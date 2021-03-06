/**
 * Trail
 * @constructor
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);

    this.path  = null;
    this.paths = [];

    this.createPath();
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Create path
 */
Trail.prototype.createPath = function()
{
    this.path = new paper.Path({
        strokeColor: this.color,
        strokeWidth: this.radius * 2 * paper.sceneScale,
        strokeCap: 'round',
        strokeJoin: 'round',
        fullySelected: false
    });
};

/**
 * Set position
 */
Trail.prototype.setPosition = function(point)
{
    if (this.path.lastSegment) {
        this.path.lastSegment.point.x = point[0] * paper.sceneScale;
        this.path.lastSegment.point.y = point[1] * paper.sceneScale;
    }
};

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    var x = point[0] * paper.sceneScale,
        y = point[1] * paper.sceneScale;

    if (!this.path.length) {
        this.path.add(x, y);
    }

    this.path.add(x, y);
};

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.clear = function()
{
    this.paths.push(this.path.rasterize());
    this.path.remove();

    this.createPath();
};

/**
 * Clear Paths
 */
Trail.prototype.clearPaths = function()
{
    for (var i = this.paths.length - 1; i >= 0; i--) {
        this.paths[i].remove();
    }

    this.paths = [];
};