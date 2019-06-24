klevu.coreEvent.attach( "setRemoteConfigLanding" , {
  name : "search-tabs" ,
  fire : function () {
    //set templates
    klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateTabResults"), "tab-results", true);
    klevu.search.landing.getScope().template.setTemplate(klevu.dom.helpers.getHTML("#klevuLandingTemplateContentBlock"), "contentBlock", true);

    // add the tab text name to the query data
    klevu.search.landing.getScope().chains.template.process.success.add( {
      name : "processTabs" ,
      fire : function ( data , scope ) {
        //search in this query ids
        var list = [ 'productList' , 'contentList' ];
        if(list.length > 0 ){
          klevu.each( list , function ( key , value ) {
            var items = klevu.getObjectPath( data.template.query , value );
            if ( !klevu.isUndefined( items ) ) {
              items.id = value;
              items.tab = true;
              items.tabText = "<b>%s</b> " + value;
            }
          } );
        }
      }
    } );

    klevu.search.landing.getScope().template.setHelper( "hasResults" , function hasResults( data , name ) {
      if ( data.query[ name ] ) {
        if ( data.query[ name ].result.length > 0 ) return true;
      }
      return false;
    } );

    //tab swap
    klevu.search.landing.getScope().chains.template.events.add( {
      name : "tabContent" ,
      fire : function ( data , scope ) {
        var target = klevu.getSetting( scope.kScope.settings , "settings.search.searchBoxTarget" );
        klevu.each( klevu.dom.find( ".kuTab" , target ) , function ( key , value ) {
          //initial
          if ( key === 0 ) {
            value.classList.add( "kuTabSelected" );
            var target = klevu.dom.helpers.getClosest( this , ".klevuWrap" );
            if ( target === null ) {
              return;
            }
            target.classList.add( this.dataset.section + "Active" );
          }
          // onclick
          klevu.event.attach( value , "click" , function ( event ) {
            event = event || window.event;
            event.preventDefault();
            //getScope
            var target = klevu.dom.helpers.getClosest( this , ".klevuWrap" );
            if ( target === null ) {
              return;
            }
            //removeSelectionFromAllTabs
            klevu.each( klevu.dom.find( ".kuTab.kuTabSelected" , target ) , function ( key , value ) {
              value.classList.remove( "kuTabSelected" );
              target.classList.remove( value.dataset.section + "Active" );
            } );
            //add Selection to current tab
            this.classList.add( "kuTabSelected" );
            target.classList.add( this.dataset.section + "Active" );

          } );
        } );
      }
    } );

  }
} );
