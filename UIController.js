UIController = (function () {
    var DOMStrings = {
        addBtn: ".add__btn",
        desc_type: ".add__type",
        desc: ".add__description",
        desc_value: ".add__value",
        inc_list: ".income__list",
        exp_list: ".expenses__list",
        percen_label: ".item__percentage",
        budget_label: ".budget__value",
        budget_income_label: ".budget__income--value",
        budget_expenses_label: ".budget__expenses--value",
        budget_expenses_percent: ".budget__expenses--percentage",
        time_label: ".budget__title--month",
        delete_btn: ".item__delete",
        container: ".container",
        typeOption: ".add__type",
    };

    var formatPercentage = function (percent) {
        if (percent == 0) return "0%";
        if (percent == -1 || percent == Infinity) return "---";
        if (percent > 999) return ">1k" + "%";
        return percent + "%";
    };

    function convertToIndianCurrency(money) {
        if(money.length<1) return money;
        var lastChar = money[money.length - 1];
        // 123456=1,23,456
        // 12345=12,345
        // 1234=1,234
        // 123=123
        var newNo = "",
            noOfCharDone = 0;
        for (var i = money.length - 2; i >= 0; i--) {
            newNo = money[i] + newNo;
            noOfCharDone++;
            if (i != 0 && noOfCharDone % 2 == 0) {
                newNo = "," + newNo;
            }
        }

        return newNo + lastChar;
    }

    var formatMoney = function (money) {
        money = parseFloat(money).toFixed(2);
        var intVal = money.substr(0, money.indexOf("."));
        intVal = convertToIndianCurrency(intVal);
        var decimalVal = money.substr(money.indexOf(".") + 1);
        return intVal + "." + decimalVal;
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    function changeToSentenceCase(text) {
        var result = "";
        var sentenceStart = true;
        for (i = 0; i < text.length; i++) {
            var ch = text.charAt(i);

            if (sentenceStart && ch.match(/^\S$/)) {
                ch = ch.toUpperCase();
                sentenceStart = false;
            } else {
                ch = ch.toLowerCase();
            }

            if (ch.match(/^[.!?]$/)) {
                sentenceStart = true;
            }

            result += ch;
        }
        return result;
    }

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },

        getInputs: function () {
            var type, desc, value;
            type = document.querySelector(DOMStrings.desc_type).value;
            desc = changeToSentenceCase(document.querySelector(DOMStrings.desc).value);
            value = parseFloat(
                document.querySelector(DOMStrings.desc_value).value.replace(/[,]/g, "")
            );

            return {
                type,
                desc,
                value,
            };
        },

        clearFields: function () {
            document.querySelector(DOMStrings.desc_value).value = "";
            document.querySelector(DOMStrings.desc).value = "";
            document.querySelector(DOMStrings.desc).focus();
        },

        addListItem: function (type, itemData) {
            var HTML, className;

            if (type == "exp") {
                HTML =
                    '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">- %val%</div> <div class="item__percentage">%percen%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

                className = DOMStrings.exp_list;
            } else {
                HTML =
                    ' <div class="item clearfix" id="income-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">+ %val%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

                className = DOMStrings.inc_list;
            }

            HTML = HTML.replace("%id%", itemData.id);
            HTML = HTML.replace("%desc%", itemData.description);
            HTML = HTML.replace("%val%", formatMoney(itemData.value));
            HTML = HTML.replace(
                "%percen%",
                formatPercentage(itemData.percentage)
            );

            document
                .querySelector(className)
                .insertAdjacentHTML("beforeend", HTML);
        },

        updatePercentages: function (percentages) {
            // avoid for each for compatibality issues.
            var elements = document.querySelectorAll(DOMStrings.percen_label);

            for (var i = 0; i < elements.length; i++) {
                elements[i].textContent = formatPercentage(percentages[i]);
            }
        },

        updateBudget: function (income, expenses) {
            var type;
            if (income == expenses) type = "  ";
            else if (income > expenses) type = "+ ";
            else type = "- ";

            document.querySelector(DOMStrings.budget_label).textContent =
                type + formatMoney(Math.abs(income - expenses));

            document.querySelector(DOMStrings.budget_income_label).textContent =
                "+ " + formatMoney(income);
            document.querySelector(
                DOMStrings.budget_expenses_label
            ).textContent = "- " + formatMoney(expenses);

            if (income > 0) {
                document.querySelector(
                    DOMStrings.budget_expenses_percent
                ).textContent = formatPercentage(
                    Math.round((expenses / income) * 100)
                );
            } else {
                document.querySelector(
                    DOMStrings.budget_expenses_percent
                ).textContent = "---";
            }
        },

        displayTime: function (month, year) {
            document.querySelector(DOMStrings.time_label).textContent =
                month + " " + year;
        },

        removeList: function (id) {
            var node = document.getElementById(id);
            node.parentElement.removeChild(node);
        },

        changeOutlines: function (event) {
            var type = event;
            if (typeof event === "object")
                type = document.querySelector(DOMStrings.desc_type).value;

            var fields = document.querySelectorAll(
                DOMStrings.desc_type +
                    "," +
                    DOMStrings.desc +
                    "," +
                    DOMStrings.desc_value
            );
            if (type == "+" || type == "inc") {
                nodeListForEach(fields, function (cur) {
                    cur.classList.remove("red-focus");
                });

                document
                    .querySelector(DOMStrings.addBtn)
                    .classList.remove("red");
            } else {
                nodeListForEach(fields, function (cur) {
                    cur.classList.add("red-focus");
                });

                document.querySelector(DOMStrings.addBtn).classList.add("red");
            }
        },

        changeType: function (key) {
            if (key == "+") {
                document.querySelector(DOMStrings.desc_type).selectedIndex = 0;
                this.changeOutlines("+");
            } else {
                document.querySelector(DOMStrings.desc_type).selectedIndex = 1;
                this.changeOutlines("-");
            }
        },

        changeToSentenceCase,
        
        convertToIndianCurrency,
    };
})();
