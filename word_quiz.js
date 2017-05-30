// IIFE

(function() {

    // constructor
    this.WordQuiz = function() {

        this.selectedWordList = [];
        this.selectedWord = '';

        // Defaults options
        var defaults = {
            wordLength: 5,
            placement: 'quizArea',
            enableCounter: 'checked',
            timeMultiplier: 5
        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        loadSettingFromLocalStorage.call(this);
        countTimer = this.options.timeMultiplier * this.options.wordLength;

        document.getElementById(this.options.placement).innerHTML = drawBoard.call(this);

    }


    // Public Methods

    WordQuiz.prototype.init = function() {
        readSelectedWords.call(this);
        getOneRandomWord.call(this);
        btnsEventListener.call(this)
        initializeEvents.call(this);
        showQuizNumber();
    }


   // Private Methods

   var drawBoard = function() {
       var htmlTemplate =`<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title pull-left">Word Quiz Game</h3>
                    <div class="pull-right">Score : <span id="correctAns">0</span> / <span id="totalQuiz">10</span></div>
                    <div class="clearfix"></div>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-2">
                            <label for="wordLength">Word Char</label>
                            <div class="input-group">
                                <input type="text"  class="form-control" id="wordLength" name="wordLength" value="${this.options.wordLength}"  />
                                <span class="input-group-btn">
                                    <button class="btn btn-primary" id="saveBtn">Save</button>
                                </span>
                            </div>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input type="checkbox" class="form-check-input" name="enableCounter" id="enableCounter" ${this.options.enableCounter}>
                                    Enable Counter
                                </label>
                            </div>
                        </div>
                        <div class="col-md-10">
                            <div class="row">
                                <div class="col-md-6 pull-right">
                                    <div class="btn-toolbar pull-right">
                                        <button type="button" id="helpBtn" class="btn btn-info btn-sm">Help</button>
                                        <button type="button" id="showAnsBtn" class="btn btn-warning btn-sm">Show Answer</button>
                                    </div>

                                    <div class="clearfix"></div>
                                    <div id="showCounterBlock" class="pull-right">
                                        Time Remaining: <span id="showCounter">0</span>s
                                    </div>
                                </div>
                            </div>
                            <div class="row container">
                                <div class="col-md-6">
                                    <div id="play"></div>
                                </div>
                             </div>

                            <div class="row" id="infoBlock"></div>
                        </div>
                    </div>
                </div>
                <div class="panel-footer">
                    <a href="#" class="btn btn-danger pull-left" role="button" id="resetBtn">Reset</a>
                    <a href="#" class="btn btn-default pull-right" role="button" id="nextBtn">Next</a>
                    <div class="clearfix"></div>
                </div>
            </div>`;

       return htmlTemplate;
   };

    var drawPuzzle = function (shuffledWord) {
        var output = '';
        output += '<ul id="columns">';

        // for each row in the puzzle
        for (var i = 0; i < shuffledWord.length; i++) {
            output += '<li class="column" draggable="true" char="' + shuffledWord.charAt(i) + '"><header>';
            output += shuffledWord.charAt(i) || '&nbsp;';
            output += '</header></li>';
        }

        // close ul
        output += '</ul>';
        document.getElementById("play").innerHTML = output;
    };

    var showQuizNumber = function() {
        document.getElementById("totalQuiz").innerHTML = localStorage.getItem('totalQuiz');
        document.getElementById("correctAns").innerHTML = localStorage.getItem('correctAns');
    };

    var getRandomValue = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var extendDefaults = function(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    };


    var readSelectedWords = function() {
        for (var i = 0; i < wordList.length; i++) {
            if (wordList[i].length == this.options.wordLength) {
                this.selectedWordList.push(wordList[i]);
            }
        }

        console.log(this.selectedWordList.length);
    };

    var getOneRandomWord = function() {

        document.getElementById("infoBlock").innerHTML = '';

        var len = this.selectedWordList.length;
        if(len > 0) {
            var selectedIndex = getRandomValue(0, len);
            this.selectedWord = this.selectedWordList[selectedIndex];
        }
        console.log(this.selectedWord);
        drawPuzzle(this.selectedWord.shuffle());

        localStorage.setItem('totalQuiz', parseInt(localStorage.getItem('totalQuiz')) + 1);
        showQuizNumber();
        showCounter.call(this);
    };

    String.prototype.shuffle = function () {
        var a = this.split(""),
            n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    };

    var saveSettingInLocalStorage = function() {
        localStorage.setItem('wordLength', document.getElementById('wordLength').value);
        location.reload();

    };

    var loadSettingFromLocalStorage = function() {
        if(localStorage.getItem('wordLength') != null && localStorage.getItem('wordLength') > 0) {
            this.options.wordLength = localStorage.getItem('wordLength')
        }

        if(localStorage.getItem('enableCounter') != null) {
            this.options.enableCounter = localStorage.getItem('enableCounter')
        }

        localStorage.setItem('totalQuiz', (localStorage.getItem('totalQuiz') != null && parseInt(localStorage.getItem('totalQuiz')) > 0) ? parseInt(localStorage.getItem('totalQuiz'))  : 0);
        localStorage.setItem('correctAns', (localStorage.getItem('correctAns') != null && parseInt(localStorage.getItem('correctAns')) > 0) ? parseInt(localStorage.getItem('correctAns'))  : 0);
    };

    var readTextfromItemList = function(){
        var currentWord = '';
        var cols = document.querySelectorAll('#columns .column');
        [].forEach.call(cols, function (col) {
            currentWord += col.getAttribute('char');
        });
        return currentWord;
    };

    var next = function() {
        getOneRandomWord.call(this);
        initializeEvents.call(this);
    };

    var showAnswer = function() {
        window.clearTimeout(quizTimer);
        document.getElementById("infoBlock").innerHTML = '<div class="alert alert-warning" role="alert">'+this.selectedWord+'</div>';
    };

    var reset = function() {
        localStorage.removeItem('wordLength');
        localStorage.removeItem('totalQuiz');
        localStorage.removeItem('correctAns');
        location.reload();
    };

    var btnsEventListener = function() {
        var wordThis = this;

        document.getElementById('helpBtn').addEventListener('click', function(e) {
            getWordDefination.call(wordThis);
        }, false);

        document.getElementById('nextBtn').addEventListener('click', function(e) {
            next.call(wordThis);
        }, false);

        document.getElementById('saveBtn').addEventListener('click', function(){
            saveSettingInLocalStorage.call(wordThis);
        }, false);

        document.getElementById('showAnsBtn').addEventListener('click', function(){
            showAnswer.call(wordThis);
        }, false);

        document.getElementById('resetBtn').addEventListener('click', function(){
            reset();
        }, false);

        document.getElementById('enableCounter').addEventListener('change', function(){
            showCounter.call(wordThis);
        }, false);
    };

    var showCounter = function() {

        window.clearTimeout(quizTimer);

        var isChecked = '';
        stopct = 1;
        if(document.getElementById('enableCounter').checked){
            isChecked = 'checked';
            document.getElementById('showCounterBlock').style.display = 'block';
            stopct = 0;
            ctsec = countTimer;
            startCT.call(this);
        }
        else{
            document.getElementById('showCounterBlock').style.display = 'none';
        }
        localStorage.setItem('enableCounter', isChecked);
    };



    var getWordDefination = function() {
        var dicUrl = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/" + this.selectedWord  +"?key=c32505e4-a086-47b6-a176-2b384b00c0b4";
        callAjax(dicUrl, function(result){
            var xmlDoc = parseXml(result);
            document.getElementById("infoBlock").innerHTML = '<div class="alert alert-info" role="alert">'+xmlDoc.getElementsByTagName("dt")[0].innerHTML+'</div>';
        });
    };

    var callAjax = function(url, callback){
        var xmlhttp, responseText;

        try {
            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    callback(xmlhttp.responseText);
                }
            }
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        } catch (e) {

        } finally {

        }

    };
    var stopct = 0;
    var countTimer = 15;
    var ctsec = countTimer;
    var quizTimer;
    var startCT = function() {

        var wordThis = this;
        // if ctsec is > 1
        if(ctsec >= 0) {
            if(stopct == 0 && document.getElementById('showCounter')) {
                document.getElementById('showCounter').innerHTML = ctsec;
                quizTimer = setTimeout(startCT.bind(wordThis), 1000);
            }
            ctsec--;
        }
        else {
            window.clearTimeout(quizTimer);
            document.getElementById("infoBlock").innerHTML = `<div class="alert alert-error" role="alert">Time is up. Anwser is <b>${this.selectedWord}</b></div>`;
        }
    };

    var parseXml;

    if (window.DOMParser) {
        parseXml = function(xmlStr) {
            return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
        parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        parseXml = function() { return null; }
    }


    // draggable events

    var initializeEvents = function() {
        var wordThis = this;
        var cols = document.querySelectorAll('#columns .column');
        cols.forEach( function(col){
            addDnDHandlers(col, wordThis);
        }.bind(this));
    }

    var addDnDHandlers = function(elem, wordThis) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragenter', handleDragEnter, false)
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('dragleave', handleDragLeave, false);
        elem.addEventListener('drop',  function(e){
            handleDrop(e, wordThis);
        }, false);
        elem.addEventListener('dragend', function(){
            handleDragEnd(this, wordThis);
        }, false);

    }
    var dragSrcEl = null;
    var handleDragStart = function(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        this.classList.add('dragElem');
    }

    var handleDragOver = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.classList.add('over');
        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    var handleDragEnter = function(e) {
        // TODO
    }

    var handleDragLeave = function(e) {
        this.classList.remove('over');
    }

    var handleDrop = function(e, wordThis) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl != e.target.parentNode) {
            e.target.parentNode.parentNode.removeChild(dragSrcEl);
            var dropHTML = e.dataTransfer.getData('text/html');
            e.target.parentNode.insertAdjacentHTML('beforebegin',dropHTML);
            var dropElem = e.target.parentNode.previousSibling;
            addDnDHandlers(dropElem, wordThis);
        }
        e.target.parentNode.classList.remove('over');

        return false;
    }

    var handleDragEnd = function(e, wordThis) {
        e.classList.remove('over');
        if(wordThis.selectedWord == readTextfromItemList()) {
            window.clearTimeout(quizTimer);
            document.getElementById("infoBlock").innerHTML = '<div class="alert alert-success" role="alert">Yes!!!, you got it :)</div>';
            localStorage.setItem('correctAns', (parseInt(localStorage.getItem('correctAns')) + 1));
            showQuizNumber();
        }
    }

    // create the XMLHttpRequest object, according browser
    var getXmlHttp = function() {
        // if browser suports XMLHttpRequest
        if (window.XMLHttpRequest) {
            // Cretes a instantce of XMLHttpRequest object
            xhttp = new XMLHttpRequest();
        }
        else {
            // for IE 5/6
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhttp;
    }

}());


var wordList =  WordList.split(" ");