# JavaScript Word Quiz Game

## Demo

<https://supankar.github.io/wordquiz/>

## Example Usage

### Include JS files

```JS
<script language="JavaScript" src="wordlist.js" type="text/javascript"></script>
<script language="JavaScript" src="word_quiz.js" type="text/javascript"></script>
```

### Inline CSS

```CSS
[draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
}

#columns {
    list-style-type: none;

}

.column {
    width: 50px;
    padding: 5px;
    text-align: center;
    cursor: move;
    display: inline-block;
}
.column header {
    color: black;
    background-color: #ccc;
    padding: 5px;
    border-bottom: 1px solid #ddd;
    border-radius: 10px;
    border: 2px solid #666666;
}

.column.dragElem {
    opacity: 0.4;
}
.column.over {
    border: 2px dashed #000;
    border-top: 2px solid blue;
}
```

Use the plugin as follows:

```js
 var wordQuiz = new WordQuiz({
    wordLength: 4,
    placement: 'quizArea',
    enableCounter: 'checked',
    timeMultiplier: 4
});

setTimeout("wordQuiz.init()",100);
```

You can alter the default options
