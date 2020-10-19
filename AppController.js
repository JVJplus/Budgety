// Main Controller
AppController = (function (BudgetCntl, UICntl) {
    var DOMStrings = UICntl.getDOMStrings();

    function ctrlAddItem() {
        var inputs = UICntl.getInputs();
        var itemData=BudgetCntl.addItem(inputs);
        UICntl.clearFields();
        UICntl.addListItem(inputs.type,itemData);

        
        // console.log(BudgetCntl.getDatas());
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
    };

    return {
        init: function () {
            addEventController();
        },
    };
})(BudgetController, UIController);

AppController.init();
