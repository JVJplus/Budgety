// Main Controller
AppController = (function (BudgetCntl, UICntl) {
    var DOMStrings = UICntl.getDOMStrings();

    function ctrlAddItem() {
        var inputs = UICntl.getInputs();

        if (!inputs.desc || isNaN(inputs.value)) return;

        var itemData = BudgetCntl.addItem(inputs);
        UICntl.clearFields();
        UICntl.addListItem(inputs.type, itemData);

        updatePercentages();
        updateBudget();
    }

    function updatePercentages() {
        BudgetCntl.updateExpensesPercentages();
        var percentages = BudgetCntl.getPercentages();
        UICntl.updatePercentages(percentages);
    }

    function updateBudget() {
        var income = BudgetCntl.getIncome();
        var expenses = BudgetCntl.getExpenses();
        UICntl.updateBudget(income, expenses);
    }

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
    }

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
        document.querySelector(DOMStrings.desc).addEventListener('keydown',changeToSentenceCase);        
    };

    function changeToSentenceCase(event){
        // if alpahabet h toh uppercase me change karo
        // TODO : https://stackoverflow.com/questions/30098133/replace-char-onkeypress
        // else auto format
        UICntl.formatDescription();
    }

    function cntrlValueSign(event) {
        // NOTE: keydown doesnt work because in android keyCode returned is always 229.  https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229

        //// if any other key than + and - then return 
        var key=event.data;
        if (!(key=='+' || key=='-')) return true;
        
        event.preventDefault(); /* Dont display in value */        
        UICntl.changeType(key);
    }

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
    }

    return {
        init: function () {
            updateTime();
            updateBudget();
            addEventController();
        },
    };
})(BudgetController, UIController);

AppController.init();
