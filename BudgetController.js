// Database Controller
BudgetController = (function () {
    // Data Base Structure

    Income = function (id, value, description) {
        this.id = id;
        this.value = value;
        this.description = description;
    };

    Expense = function (id, value, description, percentage) {
        this.id = id;
        this.value = value;
        this.description = description;
        this.percentage = percentage;
    };

    var data = {
        allItems: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
    };

    function calculatePercentage(value){
        return (value/data.totals.inc)*100;
    };

    function generateID(obj){
        if(obj.length==0) return 1;
        return obj[obj.length-1].id+1;
    }

    return {
        getDatas: function () {
            return data;
        },

        addItem:function(inputs){
            var item,id;
            if(inputs.type=='inc'){
                id=generateID(data.allItems.inc);
                item=new Income(id,inputs.value,inputs.desc);
                data.totals['inc']+=inputs.value;
            }
            else{
                id=generateID(data.allItems.exp);
                item=new Expense(id,inputs.value,inputs.desc,calculatePercentage(inputs.value));
                data.totals['exp']+=inputs.value;
            }
            data.allItems[inputs.type].push(item);
            return item;
        }
    };
})();
