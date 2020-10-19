UIController = (function () {
    var DOMStrings = {
        addBtn: ".add__btn",
        desc_type: ".add__type",
        desc: ".add__description",
        desc_value: ".add__value",
        inc_list:".income__list",
        exp_list:".expenses__list",

    };

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },

        getInputs: function () {
            var type, desc, value;
            type = document.querySelector(DOMStrings.desc_type).value;
            desc = document.querySelector(DOMStrings.desc).value;
            value = parseFloat(
                document.querySelector(DOMStrings.desc_value).value
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

        addListItem: function (type,itemData) {
            var HTML,className;
            
            if (type=='exp') {
                HTML =
                    '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">- %val%</div> <div class="item__percentage">%percen%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

                    className=DOMStrings.exp_list;
            } else {
                HTML =
                    ' <div class="item clearfix" id="income-%id%"> <div class="item__description">%desc%</div> <div class="right clearfix"> <div class="item__value">+ %val%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

                    className=DOMStrings.inc_list;
            }

            HTML=HTML.replace('%id%',itemData.id);
            HTML=HTML.replace('%desc%',itemData.description);
            HTML=HTML.replace('%val%',itemData.value);
            HTML=HTML.replace('%percen%',itemData.percentage);

            document.querySelector(className).insertAdjacentHTML('beforeend',HTML);
        },
    };
})();
