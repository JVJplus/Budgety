// Database Controller
BudgetController = (function () {
    // Data Base Structure

    Income = function (id, value, description) {
        this.id = id;
        this.value = value;
        this.description = description;
    };

    Expense = function (id, value, description) {
        this.id = id;
        this.value = value;
        this.description = description;
        this.percentage = -1;
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

    Expense.prototype.calculatePercentage= function(){
        this.percentage = Math.round((this.value/data.totals.inc)*100);
    };

    function generateID(obj){
        if(obj.length==0) return 1;
        return obj[obj.length-1].id+1;
    }

    return {
        getDatas: function () {
            return data;
        },

        getIncome:function(){
            return data.totals.inc;
        },

        getExpenses:function(){
            return data.totals.exp;
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
                item=new Expense(id,inputs.value,inputs.desc);
                data.totals['exp']+=inputs.value;
            }
            data.allItems[inputs.type].push(item);
            return item;
        },

        updateExpensesPercentages:function(){
            data.allItems.exp.forEach(function(event){
                event.calculatePercentage();
            });            
        },

        getPercentages:function(){
            var percentages=data.allItems.exp.map(function(obj){
                return obj.percentage;
            });
            return percentages;
        },

        removeList:function(type,id){
            var index=-1;
            for(var i=0;i<data.allItems[type].length;i++){
                if(data.allItems[type][i].id==id){
                    index=i;
                    break;
                }
            }

            // remove from array
            var removedItem=data.allItems[type].splice(index,1);
            var removedValue=removedItem[0].value;
            
            // change inc/exp
            data.totals[type]-=removedValue;
        }
    };
})();
