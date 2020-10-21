// Main Controller
AppController = (function (BudgetCntl, UICntl) {
    var DOMStrings = UICntl.getDOMStrings();

    function ctrlAddItem() {
        var inputs = UICntl.getInputs();

        if (!inputs.desc){
            document.querySelector(DOMStrings.desc).focus();
            return;
        } 

        if(isNaN(inputs.value)){
            var ele=document.querySelector(DOMStrings.desc_value);
            ele.focus();
            
            // FIXME: Doesnt wrong for input "12e" as input field is taking number only.
            // is some input is wrong
            if(ele.value.length)
                ele.style.color='red';
            return;
        }

        var itemData = BudgetCntl.addItem(inputs);
        UICntl.clearFields();
        UICntl.addListItem(inputs.type, itemData);

        updatePercentages();
        updateBudget();
    };

    function updatePercentages() {
        BudgetCntl.updateExpensesPercentages();
        var percentages = BudgetCntl.getPercentages();
        UICntl.updatePercentages(percentages);
    };

    function updateBudget() {
        var income = BudgetCntl.getIncome();
        var expenses = BudgetCntl.getExpenses();
        UICntl.updateBudget(income, expenses);
    };

    function updateTime() {
        var time = new Date();
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        var month = monthNames[time.getMonth()];
        var year = time.getFullYear();

        UICntl.displayTime(month, year);
    };

    addEventController = function () {
        // add
        document
            .querySelector(DOMStrings.addBtn)
            .addEventListener("click", ctrlAddItem);
        // on pressing enter key
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        // delete
        document
            .querySelector(DOMStrings.container)
            .addEventListener("click", cntrlDeleteItem);

        // ux
        document
            .querySelector(DOMStrings.typeOption)
            .addEventListener("change", UICntl.changeOutlines);

        // value change a/c to sign
        document.querySelector(DOMStrings.desc_value).addEventListener("textInput", cntrlValueSign);
        //prevent -ve value change via side btn of input div.
        document.querySelector(DOMStrings.desc_value).addEventListener("change", UICntl.preventNegativeValue);
        
        // Change Description to Sentence Case.
        document.querySelector(DOMStrings.desc).addEventListener("textInput",changeToSentenceCase);        
    };

    function changeToSentenceCase(event){
        // if alpahabet h toh uppercase me change karo and caret default position me dal do

        var key=event.data;
        if(! (  (key>='a' && key<='z')||(key>='A'&&key<='Z') ) ){
            console.log('returned');
            return;
        }

        //cant use preventDefault as its hidding the typed char in long sentences. so use setTimeOut.
        event.preventDefault(); /* Dont print the character */

        var caret=this.selectionStart;
        var newText=this.value.substr(0,caret)+key+this.value.substr(caret);

        this.value=UICntl.changeToSentenceCase(newText);
        this.selectionStart=caret+1;
        this.selectionEnd=caret+1;

        // try scrolling till view of hidden texts in long sentences
        // if is for handling the case when some words are inserted in between of sentences.
        if(this.scrollLeft>=30 || caret>=10){
            this.scrollLeft=this.scrollLeft+10;
        }

        // remove the repeat key pressed by event
        // not working properly as UX. shadows are seen.
        // var domEle=this;
        // setTimeout(()=>{domEle.value = domEle.value.substr(0,domEle.value.length-1);});
    };

    function cntrlValueSign(event) {
        // NOTE: keydown doesnt work because in android keyCode returned is always 229.  https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229

        //// if any other key than + and - then return 
        var key=event.data;
        if (!(key=='+' || key=='-')) return true;
        
        event.preventDefault(); /* Dont display in value */        
        UICntl.changeType(key);
    };

    function cntrlDeleteItem(event) {
        if (
            "." + event.target.parentElement.parentElement.className !=
            DOMStrings.delete_btn
        )
            return;

        var elementID =
            event.target.parentElement.parentElement.parentElement.parentElement
                .id;
        var type = elementID.split("-")[0];
        type = type == "income" ? "inc" : "exp";
        var id = elementID.split("-")[1];

        BudgetCntl.removeList(type, id);
        UICntl.removeList(elementID);
        updateBudget();
        updatePercentages();
    };

    return {
        init: function () {
            updateTime();
            updateBudget();
            addEventController();
        },
    };
})(BudgetController, UIController);

AppController.init();
