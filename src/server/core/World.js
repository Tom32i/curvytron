/**
 * World
 */
function World(size)
{
    this.size       = size;
    this.from       = [0, 0];
    this.to         = [size, size];
    this.islands    = new Collection();
    this.islandSize = this.size / this.islandGridSize;
    this.active     = false;

    var x, y, id;

    for (y = this.islandGridSize - 1; y >= 0; y--) {
        for (x = this.islandGridSize - 1; x >= 0; x--) {
            id = x.toString() + ':' + y.toString();
            this.islands.add(new Island(id, this.islandSize, [x * this.islandSize, y * this.islandSize]));
        }
    }
}

/**
 * Island grid size
 *
 * @type {Number}
 */
World.prototype.islandGridSize = 4;

/**
 * Get island by point
 *
 * @param {Array} point
 *
 * @return {Island}
 */
World.prototype.getIslandByPoint = function(point)
{
    var x = Math.floor(point[0]/this.islandSize),
        y = Math.floor(point[1]/this.islandSize),
        id = x.toString() + ':' + y.toString();

    return this.islands.getById(id);
};

/**
 * Get island by circle
 *
 * @param {Array} circle
 *
 * @return {Island}
 */
World.prototype.getIslandsByCircle = function(circle)
{
    var islands = new Collection(),
        sources = [
            this.getIslandByPoint([circle[0] - circle[2], circle[1] - circle[2]]),
            this.getIslandByPoint([circle[0] + circle[2], circle[1] - circle[2]]),
            this.getIslandByPoint([circle[0] - circle[2], circle[1] + circle[2]]),
            this.getIslandByPoint([circle[0] + circle[2], circle[1] + circle[2]])
        ];

    for (var i = sources.length - 1; i >= 0; i--) {
        if (sources[i]) {
            islands.add(sources[i]);
        }
    }

    return islands.items;
};

/**
 * Add circle
 *
 * @param {Array} circle
 */
World.prototype.addCircle = function(circle)
{
    if (!this.active) {
        return;
    }

    var islands = this.getIslandsByCircle(circle);

    for (var i = islands.length - 1; i >= 0; i--) {
        islands[i].addCircle(circle);
    }
};

/**
 * Add circle
 *
 * @param {Array} circle
 */
World.prototype.testCircle = function(circle)
{
    if (!this.circleInBound(circle, this.from, this.to)) {
        return false;
    }

    var islands = this.getIslandsByCircle(circle);

    for (var i = islands.length - 1; i >= 0; i--) {
        if (!islands[i].testCircle(circle)) {
            return false;
        }
    }

    return true;
};

/**
 * Is point in bound?
 *
 * @param {Array} circle
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
World.prototype.circleInBound = function(circle, from, to)
{
    return circle[0] - circle[2] >= from[0] &&
           circle[0] + circle[2] <= to[0]   &&
           circle[1] - circle[2] >= from[1] &&
           circle[1] + circle[2] <= to[1];
};

/**
 * Random Position
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
World.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point = this.getRandomPoint(margin);

    while (!this.testCircle([point[0], point[1], margin, 0])) {
        point = this.getRandomPoint(margin);
    }

    return point;
};

/**
 * Get random point
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
World.prototype.getRandomPoint = function(margin)
{
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ];
};

/**
 * Clear the world
 */
World.prototype.clear = function()
{
    for (var i = this.islands.items.length - 1; i >= 0; i--) {
        this.islands.items[i].clear();
    }

    this.active = false;
};

/**
 * Activate
 */
World.prototype.activate = function()
{
    this.active = true;
};