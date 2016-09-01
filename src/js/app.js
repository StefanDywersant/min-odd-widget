(function () {
   'use strict';

   var MinOddWidget = CoreLibrary.Component.subclass({
      defaultArgs: {
         limit: 3, // events count
         filter: 'all/all/all' // default events filter
      },

      constructor () {
         CoreLibrary.Component.apply(this, arguments);
      },

      init () {
         CoreLibrary.offeringModule.getEventsByFilter(this.scope.args.filter)
            .then((response) => {
               // handle empty events case
               if (response.events == null) {
                  this.scope.events = [];
                  return;
               }

               this.scope.events = response.events
                   // filter out events which are not matches or have not bet offers/outcomes
                   .filter((event) => {
                      return event.event.type === 'ET_MATCH' &&
                         event.betOffers.length > 0 &&
                         event.betOffers[0].outcomes.length > 0;
                   })

                   // sort over lowest odd
                   .sort((e1, e2) => e1.betOffers[0].outcomes[0].odds - e2.betOffers[0].outcomes[0].odds)

                   // limit results
                   .slice(0, this.scope.args.limit)

                   // apply rivets hacks
                   .map((event) => {
                      event.betOffers = event.betOffers[0];
                      event.navigateToEvent = () => CoreLibrary.widgetModule.navigateToEvent(event.event.id);
                      return event;
                   });
            });
      }
   });

   var minOddWidget = new MinOddWidget({
      rootElement: 'html'
   });
})();

rivets.formatters.length = function (arr) {
   return arr ? arr.length : 0;
};
