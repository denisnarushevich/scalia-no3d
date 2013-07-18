define(function () {
    function AssetManager() {
        this.assets = {};
    }

    AssetManager.prototype.assets = {};

    AssetManager.prototype.getAsset = function (name, onsuccess, onprogress) {
        if (this.assets[name] !== undefined) {
            onsuccess(this.assets[name]);
        } else {
            this.loadAsset(name, onsuccess, onprogress);
        }
    };

    AssetManager.prototype.releaseAsset = function (name) {
        if (this.assets[name] !== undefined)
            delete this.assets[name];
    }

    AssetManager.prototype.loadAsset = function (name, onsuccess, onprogress) {
        var assetManager = this,
            xhr = new XMLHttpRequest();

        xhr.open("GET", name, true);
        xhr.responseType = "blob";

        if (onprogress) xhr.addEventListener('progress', onprogress);

        xhr.addEventListener('load', function (e) {
            var blob = xhr.response,
                type = blob.type.split('/')[0];

            if (type === 'image') {
                var img = assetManager.assets[name] = new Image();
                img.addEventListener('load', function () {
                    onsuccess(img);
                });
                img.src = URL.createObjectURL(blob);
                return;
            } else if (type === 'audio') {
                var audio = assetManager.assets[name] = new Audio();
                audio.addEventListener('load', function () {
                    onsuccess(audio);
                });
                audio.src = URL.createObjectURL(blob);
                return;
            } else {
                onsuccess(assetManager.assets[name] = blob);
                return;
            }
        });

        xhr.send();

        return xhr;
    };

    AssetManager.prototype.loadBatch = function (batch, onsuccess, onprogress) {
        var overallProgress = 0,
            loadedAssets = [],
            batchLength = batch.length,
            i, name;

        for (var i = 0; i < batchLength; i++) {
            name = batch[i];
            this.loadAsset(
                name,
                function (asset) {
                    loadedAssets.push(asset);
                    if (loadedAssets.length === batchLength) {
                        onsuccess(loadedAssets);
                    }
                },
                function (progress) {
                    var xhr = progress.target,
                        np = progress.loaded / progress.total;

                    overallProgress += (np - (xhr.progress || 0)) / batchLength;
                    xhr.progress = np;

                    onprogress(overallProgress);
                });
        }
    }

    return new AssetManager();
});
