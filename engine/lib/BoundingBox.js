define(function(){
    var BoundingBox = {};

    BoundingBox.Create = function(min, max){
        return [min, max];
    }

    /**
     * Calculates bounding box out of vertices.
     * @param {Array} vertices
     * @return {BoundingBox}
     */
    BoundingBox.Calculate = function(boundingBox, vertices){
        var maxX = 0,
            minX = 0,
            maxY = 0,
            minY = 0,
            maxZ = 0,
            minZ = 0,
            verticesCount = vertices.length,
            vertex, i;
        
        for(i = 0; i < verticesCount; i++){
            vertex = vertices[i];
            
            
            if(vertex[0] > maxX)
                maxX = vertex[0];
            else if(vertex[0] < minX)
                minX = vertex[0];

            
            if(vertex[1] > maxY)
                maxY = vertex[1];
            else if(vertex[1] < minY)
                minY = vertex[1];

            
            if(vertex[2] > maxZ)
                maxZ = vertex[2];
            else if(vertex[2] < minZ)
                minZ = vertex[2];
        }

        boundingBox[0] = [minX, minY, minZ];
        boundingBox[1] = [maxX, maxY, maxZ];

        return boundingBox;
    }

    BoundingBox.Intersects = function(a, b){
        return !(a[0][0] > b[1][0] || a[1][0] < b[0][0] || a[0][1] > b[1][1] || a[1][1] < b[0][1] || a[0][2] > b[1][2] || a[1][2] < b[0][2]);
    }

    BoundingBox.Contains = function(a, b){
        return b[0][0] >= a[0][0] && b[1][0] <= a[1][0] && b[0][1] >= a[0][1] && b[1][1] <= a[1][1] && b[0][2] >= a[0][2] && b[1][2] <= a[1][2];
    }

    BoundingBox.ContainsPoint = function(box, point){
        return point[0] >= box[0][0] && point[0] <= box[1][0] && point[1] >= box[0][1] && point[1] <= box[1][1] && point[2] >= box[0][2] && point[2] <= box[1][2];
    }

    return BoundingBox;
});
