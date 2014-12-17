 var dndSupported;    // true if drag and drop supported
        var dndEls = new Array();
        var draggingElement;
        var winners = {
            Rock: "Paper",
            Paper: "Scissors",
            Scissors: "Rock",
            Lizard: "Scissors",
            Spock: "Lizard"
        };

        var winners2 = {
            Rock: "Spock",
            Paper: "Lizard",
            Scissors: "Spock",
            Lizard: "Rock",
            Spock: "Paper"
        };
  
        var hoverBorderStyle = "2px dashed #999999";
        var normalBorderStyle = "2px solid #FFFFFF"

        function detectDragAndDrop() {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) {
                    var rv = parseFloat( RegExp.$1 );
                    if(rv >= 6.0) return true;
                    }
                return false;
            }
            if ('draggable' in document.createElement('span')) return true;
            return false;
        }

        //Event Handlers

        function handleDragStart(e) {
            var rpsType = getRPSType(this);
            draggingElement = this;
            draggingElement.className = "moving";
            statusMessage('Drag ' + rpsType);
            this.style.opacity = "0.4";
            this.style.border = hoverBorderStyle;
            e.dataTransfer.setDragImage(getRPSImg(this), 120, 120); //Sets the drag image
        }

        function handleDragEnd(e) {
            this.style.opacity = "1.0";

            //Reset element style
            draggingElement.className = undefined;
            draggingElement = undefined;

            //Reset all of the elements
            for(var i = 0; i < dndEls.length; i++) {
                dndEls[i].style.border = normalBorderStyle;
            }
        }

        function handleDragOver(e) {
            /*dragover prevents drop event from firing.
            / This handler prevents the default action and allows the drop event to fire.
            / Use any time you use drag and drop in HTML5
            */
            if(e.preventDefault) e.preventDefault();
            this.style.border = hoverBorderStyle;

            return false; //Used by some browsers to stop default action.
        }

        function handleDragEnter(e) {
            if(this!== draggingElement) statusMessage('Hover ' + getRPSType(draggingElement) + ' over ' + getRPSType(this));
            this.style.border = hoverBorderStyle;
        }

        function handleDragLeave(e) {
            this.style.border = normalBorderStyle;
        }

        function handleDrop(e) {
            if(e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
            if(e.preventDefault) e.preventDefault();
            if(this.id === draggingElement.id) return;
            else isWinner(this, draggingElement);
        }

        //utility functions

         function isWinner(under, over) {
            var underType = getRPSType(under);
            var overType = getRPSType(over);
            if(overType == winners[underType]) {
                statusMessage(overType + ' beats ' + underType);
                swapRPS(under, over);
            }else if(overType == winners2[underType]) {
                statusMessage(overType + ' beats ' + underType);
                swapRPS(under, over);
             }else {
                statusMessage(overType + ' does not beat ' + underType);
            }
        }

        function getRPSFooter(e) {
            var children = e.childNodes;
            for( var i = 0; i < children.length; i++ ) {
                if( children[i].nodeName.toLowerCase() == 'footer' ) return children[i];
            }
            return undefined;
        }

        function getRPSImg(e) {
            var children = e.childNodes;
            for( var i = 0; i < children.length; i++ ) {
                if( children[i].nodeName.toLowerCase() == 'img' ) return children[i];
            }
            return undefined;
        }

        function getRPSType(e) {
            var footer = getRPSFooter(e);
            if(footer) return footer.innerHTML;
            else return undefined;
        }

        function swapRPS(a, b) {
            var holding = Object();

            holding.img = getRPSImg(a);
            holding.src = holding.img.src;
            holding.footer = getRPSFooter(a);
            holding.type = holding.footer.innerHTML;
            
            holding.img.src = getRPSImg(b).src;
            holding.footer.innerHTML = getRPSType(b);

            getRPSImg(b).src = holding.src;
            getRPSFooter(b).innerHTML = holding.type;
        }

        var elStatus;
        function element(id) { return document.getElementById(id); }

        function statusMessage(s) {
            if(!elStatus) elStatus = element('statusMessage');
            if(!elStatus) return;
            if(s) elStatus.innerHTML = s;
            else elStatus.innerHTML = '&nbsp;';
        }

        

        
        function init() {
            if((dndSupported = detectDragAndDrop())) {
                statusMessage('Using HTML5 Drag and Drop');
                dndEls.push(element("rps1"), element("rps2"), element("rps3"), element("rps4"), element("rps5"));
                for(var i = 0; i < dndEls.length; i++) {
                    dndEls[i].addEventListener("dragstart", handleDragStart, false);
                    dndEls[i].addEventListener("dragend", handleDragEnd, false);
                    dndEls[i].addEventListener("dragover", handleDragOver, false);
                    dndEls[i].addEventListener("dragenter", handleDragEnter, false);
                    dndEls[i].addEventListener("dragleave", handleDragLeave, false);
                    dndEls[i].addEventListener("drop", handleDrop, false);
                }
                
            } else {
                statusMessage('This browser does not support Drag and Drop');
            }
        }

        window.onload = function() {
            init();
        }
 