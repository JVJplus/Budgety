// Main Controller
AppController = (function (BudgetCntl, UICntl) {
    var DOMStrings = UICntl.getDOMStrings();

    function ctrlAddItem() {
        var inputs = UICntl.getInputs();

        if (!inputs.desc) {
            document.querySelector(DOMStrings.desc).focus();
            return;
        }

        if (isNaN(inputs.value)) {
            var ele = document.querySelector(DOMStrings.desc_value);
            ele.focus();

            // FIXME: Doesnt wrong for input "." as input field is taking number only.
            // is some input is wrong
            if (ele.value.length) {
                ele.style.color = "red";
                setTimeout(() => {
                    ele.style.color = "inherit";
                }, 500);
            }

            return;
        }

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
        document
            .querySelector(DOMStrings.desc_value)
            .addEventListener("textInput", cntrlValueSign);

        // use library: http://autonumeric.org/
        // https://medium.com/outsystems-experts/javascript-events-unmasked-how-to-create-an-input-mask-for-mobile-fc0df165e8b2

        // Handle Backspacing
        document
            .querySelector(DOMStrings.desc_value)
            .addEventListener("keydown", handleValueModification);

        // Auto Change To Indian Style.
        document
            .querySelector(DOMStrings.desc_value)
            .addEventListener("textInput", changeToIndianStyle);


        // Change Description to Sentence Case.
        document
            .querySelector(DOMStrings.desc)
            .addEventListener("textInput", changeToSentenceCase);
            
        // Handle Backspacing
        document
            .querySelector(DOMStrings.desc)
            .addEventListener("keydown", handleDescModification);
    };

    function changeToIndianStyle(event) {
        var key = event.data;
        function isDoubleDots() {
            var isDotPresent = this.value.indexOf(".");
            if (isDotPresent == -1) return false;
            return key == ".";
        }

        if (event.ctrlKey || event.shiftKey) return;

        // to handle case of selected all then replace all
        if (
            this.selectionStart == 0 &&
            this.selectionEnd == this.value.length
        ) {
            this.value = "";
            return;
        }

        // we will handle via adding key value manually!
        event.preventDefault();
        // ignore everything except numbers
        if (/[^0-9.]/.test(key) || isDoubleDots.call(this)) {
            return;
        }

        // add comma
        var caret = this.selectionStart;
        var oldValRaw =
            this.value.substr(0, caret) + key + this.value.substr(caret);
        var noOfDigitsBeforeCaret = oldValRaw
            .substr(0, caret)
            .replace(/[^\d]/g, "").length;
        var oldVal = oldValRaw.replace(/[,]/g, "");

        var intVal = oldVal,
            decimalVal = "";
        if (oldVal.indexOf(".") != -1) {
            intVal = oldVal.substr(0, oldVal.indexOf("."));
            decimalVal = oldVal.substr(oldVal.indexOf("."));
        }

        // prevent leading zeros
        while (intVal.length && intVal[0] == "0") {
            intVal = intVal.substr(1);
            noOfDigitsBeforeCaret--;
        }

        intVal = UICntl.convertToIndianCurrency(intVal);
        var newVal = intVal + decimalVal;

        this.value = newVal;

        if (key == ".") {
            // in case of dots no of digis before caret should be same
            setCaretAfterDigits(this, noOfDigitsBeforeCaret);
            // and caret should be after .
            this.selectionEnd = this.selectionStart = this.selectionEnd + 1;
        } else {
            setCaretAfterDigits(this, noOfDigitsBeforeCaret + 1);
        }

        // hortizontal scroll
        if (this.scrollLeft >= 30 || caret >= 10) {
            this.scrollLeft = this.scrollLeft + 10;
        }
    }

    function setCaretAfterDigits(obj, digits) {
        if (digits == 0) {
            obj.selectionStart = obj.selectionEnd = 0;
            return;
        }

        var cnt = 0,
            s = obj.value;
        for (var i = 0; i < s.length; i++) {
            if (s[i] >= 0 && s[i] <= 9) {
                cnt++;
            }
            if (cnt == digits) {
                // obj.selectionStart = obj.selectionEnd = i + 1;
                setCaretPosition(obj, i + 1, i + 1);
                return;
            }
        }
        obj.selectionStart = obj.selectionEnd = s.length;
    }

    function setCaretPosition(ctrl, start, end) {
        // IE >= 9 and other browsers
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(start, end);
        }
        // IE < 9
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd("character", end);
            range.moveStart("character", start);
            range.select();
        }
    }

    function handleValueModification(event) {
        var oldObj = this;
        var oldCaret = this.selectionStart;
        var oldText = this.value;
        var keyCode = event.keyCode;
        var lengthBefore = this.value.length;
        var noOfDigitsBeforeCaret = oldText
            .substr(0, oldCaret)
            .replace(/[^\d]/g, "").length;

        function dolater() {
            var obj = document.querySelector(DOMStrings.desc_value);

            // handle 1st character should not be anything other than digits
            obj.value = obj.value.replace(/[^0-9,.]/g, "");
            var lengthAfter = obj.value.length;
            var newText = obj.value;

            if (event.ctrlKey || event.shiftKey) return;

            var caretNew = obj.selectionStart;
            var oldVal = obj.value.replace(/[,]/g, "");
            var intVal = oldVal,
                decimalVal = "";
            if (oldVal.indexOf(".") != -1) {
                intVal = oldVal.substr(0, oldVal.indexOf("."));
                decimalVal = oldVal.substr(oldVal.indexOf("."));
            }
            intVal = UICntl.convertToIndianCurrency(intVal);
            var newVal = intVal + decimalVal;
            obj.value = newVal;

            // delete
            if (keyCode == 46) {
                if (oldText[oldCaret] == ".") {
                    // console.log('deleted -> .');
                    setCaretAfterDigits(obj, noOfDigitsBeforeCaret);
                } else if (oldText[oldCaret] == ",") {
                    // console.log('deleted -> ,');
                    obj.selectionEnd = obj.selectionStart = oldCaret + 1;
                } else {
                    // console.log('delete -> d');
                    setCaretAfterDigits(obj, noOfDigitsBeforeCaret);
                }
            }
            // backspace

            if (keyCode == 8) {
                if (
                    oldCaret == 0 ||
                    (oldCaret - 1 >= 0 && oldText[oldCaret - 1] == ".")
                ) {
                    // console.log('deleted <- .');
                    setCaretAfterDigits(obj, noOfDigitsBeforeCaret);
                } else if (oldCaret - 1 >= 0 && oldText[oldCaret - 1] == ",") {
                    // console.log('deleted <- ,');
                    obj.selectionEnd = obj.selectionStart = caretNew;
                } else if(oldText.replace('[\D]','').length > newText.replace('[\D]','').length) {
                    // console.log('delete <- d');
                    setCaretAfterDigits(obj, noOfDigitsBeforeCaret - 1);
                }
            }

            //add for android backspace, use trick that length will decrease on backspace, since keyCode will not work in android. on android everything returns 229.
            
            if (keyCode == 229) {
                //handle ,
                if (oldText.length==newText.length) {
                    // console.log('deleted <- ,');
                    obj.selectionEnd = obj.selectionStart = caretNew;
                } 

                if (oldText.length>newText.length) {
                    // console.log('delete <- d');
                    setCaretAfterDigits(obj, noOfDigitsBeforeCaret - 1);
                }
                // handle .
                // if new . is added
                if(oldText.indexOf('.')==-1){
                    var dotIndex=newVal.indexOf('.');
                    if(dotIndex!=-1){
                        setCaretPosition(obj, dotIndex+1,dotIndex+1);
                    }
                }
                // if . is removed
                else{
                    var dotIndex=oldVal.indexOf('.');
                    setCaretAfterDigits(obj, noOfDigitsBeforeCaret);
                }
            }

        }
        setTimeout(dolater);
    }

    function handleDescModification(event) {
        // NOTE: Doesn't handle the case when cutted.
        function dolater() {
            if (event.ctrlKey || event.shiftKey) return;

            obj = document.querySelector(DOMStrings.desc);
            var caret = obj.selectionStart;
            obj.value = UICntl.changeToSentenceCase(obj.value);
            obj.selectionStart = obj.selectionEnd = caret;
        }
        setTimeout(dolater);
    }

    function changeToSentenceCase(event) {
        // NOTE: This doesn't handle the cases of pasting, deleting via backspace and delete, cut etc '.' and automatically transforming text. So, new handleModification function was added.

        if (event.ctrlKey || event.shiftKey) return;
        // to handle case of selected all then replace all
        if (
            this.selectionStart == 0 &&
            this.selectionEnd == this.value.length
        ) {
            this.value = "";
            return;
        }

        var key = event.data;

        event.preventDefault(); /* Dont print the character */

        var caret = this.selectionStart;
        var newText =
            this.value.substr(0, caret) + key + this.value.substr(caret);

        this.value = UICntl.changeToSentenceCase(newText);
        this.selectionStart = caret + 1;
        this.selectionEnd = caret + 1;

        // try scrolling till view of hidden texts in long sentences
        // if is for handling the case when some words are inserted in between of sentences.
        if (this.scrollLeft >= 30 || caret >= 10) {
            this.scrollLeft = this.scrollLeft + 10;
        }

        // remove the repeat key pressed by event
        // not working properly as UX. shadows are seen.
        // var domEle=this;
        // setTimeout(()=>{domEle.value = domEle.value.substr(0,domEle.value.length-1);});
    }

    function cntrlValueSign(event) {
        // NOTE: keydown doesnt work because in android keyCode returned is always 229.  https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229

        //// if any other key than + and - then return
        var key = event.data;
        if (!(key == "+" || key == "-")) return true;

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
