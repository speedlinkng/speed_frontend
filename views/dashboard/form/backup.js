
document.addEventListener('alpine:init', () => {
    const conditionSymbolMap = {
        greater: '>',
        less: '<',
        equal: '===',
        less_equal: '<=',
        greater_equal: '>=',
        empty: '===',
        not_empty: '!==',
        contains: '.includes',
        does_not_contain: '! .includes',
        checked: '=== true',
        not_checked: '=== false'
    };

    function pushConditionWithSymbol(conditionValue, arrayType, _conditionsWord) {
        arrayType.push(conditionSymbolMap[conditionValue] || conditionValue);
        _conditionsWord.push(conditionValue);
        //console.log(arrayType)
    }
          
    function comparedPush(compareValue, arrayType, arrcondition, count) {
      // alert(arrcondition[count-1])
      if(arrcondition[count-1] === 'greater' || arrcondition[count-1] == 'less'||arrcondition[count-1] == 'less_equal'||arrcondition[count-1] == 'greater_equal'){
        const doubleValue = parseFloat(compareValue);
  
        // Check if the conversion is successful (not NaN)
        if (!isNaN(doubleValue)) {
            arrayType.push(doubleValue);
        } else {
            // Handle the case where compareValue is not a valid double
            console.error('Invalid compareValue:', compareValue);
        }
      }
      
      if(arrcondition[count-1] === 'empty' || arrcondition[count-1] === 'not_empty'|| arrcondition[count-1] === 'does_not_contain'|| arrcondition[count-1] === 'contains'|| arrcondition[count-1] === 'not_checked' || arrcondition[count-1] === 'equal'){
        arrayType.push(compareValue.toString());
       
      }
      
      //console.log(arrayType)
  }
   

    Alpine.data('dropdown', () => ({
        open: false,
        items: [],
        conditionsTest: [],
        getrealJson(jsonData_){
         // console.log(this.jsonData)
        },

        checkFor(index,conditionField,arr1,arr2,arr3){
          // console.log(index)
          
          if(arr1[index-1] !== '' && arr2[index-1] !== '' && (arr3[index-1] !== '' && arr3[index-1] !== undefined)){
            const parm1 = arr1[index-1]
            const operand = arr2[index-1]
            const parm3 = arr3[index-1]
            const condition = `"${parm1}" ${operand} ${parm3}`;
            console.log(condition)
            this.conditionsTest.push(
            {
              pointField: parm1.replace(/\s/g, ''), 
                condition: {
                  param1: parm1,
                  operand: operand,
                  param3: parm3
                }, 
              conditionField:conditionField.replace(/\s/g, ''),
              status:''
            });

            console.log('conditionsTest')
            console.log(this.conditionsTest)

          }else{
            // alert('no')
          }
          console.log(this.completeCondition)
          console.log(this._if)
        
          /*  if ((this._if).toLowerCase() == 'all') {
       
            const allConditionsMet = this.completeCondition.every(condition => condition);
            console.log('All conditions met:', allConditionsMet);
            this.showLabel = allConditionsMet
            // Add logic for the case when all conditions are met
        }
        
        if ((this._if).toLowerCase() == 'any') {
            const anyConditionMet = this.completeCondition.some(condition => condition);
            console.log('Any condition met:', anyConditionMet);
            this.showLabel = anyConditionMet
            // Add logic for the case when any condition is met
        }*/
        },
        comparedPush(con, cond, arrCond, count) {
          comparedPush(con, cond, arrCond, count);
        },
        conditionPush(con, cond,_conditionsWord) {
            pushConditionWithSymbol(con, cond, _conditionsWord);
        },
        
        autoClick(showLabel, fieldValue){
          console.log('=======================')
          console.log(this.conditionsTest)
          
          this.showLabel = !this.showLabel
          return
        // check complete condition to see if this field showlabel has been updated
              
        
          
        },
        autoClickClass(conditionField) {
          console.log(conditionField)
          const clickClass = document.querySelectorAll(`.${conditionField}`);
          console.log(clickClass)
          // Check if the button inside #button1 exists
          if (clickClass) {
            clickClass.forEach(clickClass_ => {
              clickClass_.click();
            });
              // Programmatically trigger a click on the button
             // clickClass.click();
          } else {
              console.error("Button inside #button1 not found.");
          }
        },  
        handleInput(fieldValue, fieldIndex) {
          let _if 
          this.conditionPointer
          console.log(this.conditionsTest)
          const foundItems = this.conditionsTest.filter(item => item.pointField === fieldValue.replace(/\s/g, ''));

         
          if (foundItems.length > 0) {
             console.log('Item found:', foundItems);
             console.log('in:', this.conditionsTest);
             foundItems.forEach(foundItem => {
              const newParam1 = this.inputValue;
              const operand = foundItem.condition.operand;
              const param3 = foundItem.condition.param3;
              let finalCondition = ''
              if (typeof param3 === "string") {
                 finalCondition = `"${newParam1}" ${operand} "${param3}"`;
              } else if (typeof param3 === "number") {
                finalCondition = `${newParam1} ${operand} ${param3}`;
              }
              console.log(finalCondition)
              foundItem.status = eval(finalCondition)
              console.log(foundItem.status)
              if (eval(finalCondition)) {
               
                  this.completeCondition.push(true);
              } else {
                  console.log('not greater');
                
                  this.completeCondition.push(false);
              }
          
              console.log('Final Condition:', finalCondition);
              console.log('Complete Condition:', this.completeCondition);
              console.log('Complete Condition:', this.conditionsTest);
         

              // get length based on the conditionfield
              // Filter the array based on the conditionField
              const filteredArray = this.conditionsTest.filter(item => item.conditionField === foundItem.conditionField);

              // Get the length of the filtered array
              const lengthOfCurrentConditionTest = filteredArray.length;
              // GET THE IF 'ALL' OR 'ANY ' CONDITION OF THE CODITION FIELD
              const conditionFieldIF = document.querySelector(`.${foundItem.conditionField}`);
             
              
              if (conditionFieldIF) {
                _if = conditionFieldIF.value
              } else {
                _if = 'omo'
              }
              // Check if that is all the conditions there is in this system
              if(foundItems.length < lengthOfCurrentConditionTest){
                  console.log(this.conditionsTest)
                  console.log('more condtions are to be met')



                  // Now we have to check the conditionField, and process its own condition
                  if ((_if).toLowerCase() == 'all') {  
                    console.log('This is ALL')                
                    // Check if every condition has a matching conditionField and the status is true
                    const allConditionsTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .every(item => item.status === true);
                    console.log('every condition matches',allConditionsTrue, foundItem.conditionField)
                    if(allConditionsTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                    }else{ console.log('not all match')}
                   // this.showLabel = allConditionsTrue
                    // Add logic for the case when all conditions are met
                  }
                  if ((_if).toLowerCase() == 'any') {
                    console.log('This is ANY')
                    const anyConditionTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .some(item => item.status === true);
                    console.log('ANY condition matches',anyConditionTrue)
                    
                    if(anyConditionTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                    }else{ console.log('not all match')}

                  }
              }else{
                  console.log('no more')
                  if ((_if).toLowerCase() == 'any') {
                    console.log('This is ANY')
                    const anyConditionTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .some(item => item.status === true); 
                    console.log('ANY condition matches',anyConditionTrue, foundItem.conditionField)
                    if(anyConditionTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                    }else{ console.log('not all match')}
                  }
                  if ((_if).toLowerCase() == 'all') {  
                    console.log('This is ALL')                
                    // Check if every condition has a matching conditionField and the status is true
                    const allConditionsTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .every(item => item.status === true);
                    console.log('every condition matches',allConditionsTrue, foundItem.conditionField)
                    if(allConditionsTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                    }else{ console.log('not all match')}
                   // this.showLabel = allConditionsTrue
                    // Add logic for the case when all conditions are met
                  }
              }

          })
              
              
              // Perform some action with the found item
          } else {
              console.log('Item not found');
              // Perform some action when the item is not found
          }
          
      },                             
        
    }));
});
