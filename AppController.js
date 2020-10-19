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
        document
            .querySelector(DOMStrings.addBtn)
            .addEventListener("click", ctrlAddItem);
        // on pressing enter key
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document
            .querySelector(DOMStrings.container)
            .addEventListener("click", cntrlDeleteItem);
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

        BudgetCntl.removeList(type,id);
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
