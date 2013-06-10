/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

function PageSlider(container) {

    var container = container,
        currentPage = null,
        stateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page) {

        var l = stateHistory.length,
            state = window.location.hash;

        if (page === currentPage) {
            return;
        }

        if (l === 0) {
            stateHistory.push(state);
            return this.slidePageFrom(page);
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            return this.slidePageFrom(page, 'left');
        } else {
            stateHistory.push(state);
            return this.slidePageFrom(page, 'right');
        }

    }

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, from) {

        console.log("slide " + from);

        var deferred = $.Deferred();

        container.append(page);

        if (!currentPage || !from) {
            console.log('no current page');
            currentPage = page;
            page.attr("class", "page center");
            console.log('after attr');
            deferred.resolve();
            return deferred;
        }

        // Position the page at the starting position of the animation
        try {
            page.attr("class", "page " + from);
        } catch(e) {
            console.log("error");
            console.log(e);
        }

        currentPage.one('webkitTransitionEnd', function(e) {
            $(e.target).remove();
            console.log("page removed");
            deferred.resolve();
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.attr("class", "page transition center");
        currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        currentPage = page;

        return deferred;
    },

    this.resetHistory = function() {
        stateHistory = [window.location.hash];
    }

    this.removeCurrentPage = function() {
        currentPage.remove();
        currentPage = null;
    }

}