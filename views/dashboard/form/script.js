
document.addEventListener('alpine:init', () => {
const conditionSymbolMap = {
        greater: '>',
        less: '<',
        equal: '===',
        less_equal: '<=',
        greater_equal: '>=',
        empty: `=== ""`,
        not_empty: `!== ""`,
        contains: '.includes',
        does_not_contain: '!.includes',
        checked: '=== true',
        not_checked: '=== false'
    };

    function pushConditionWithSymbol(conditionValue, arrayType, _conditionsWord) {
        arrayType.push(conditionSymbolMap[conditionValue] || conditionValue);
        _conditionsWord.push(conditionValue);
       
    }
          
    function comparedPush(compareValue, arrayType, arrcondition, count) {
      // alert(arrcondition[count-1])
      if(arrcondition[count-1] === 'greater' || arrcondition[count-1] == 'less'||arrcondition[count-1] == 'less_equal'||arrcondition[count-1] == 'greater_equal'){
        const doubleValue = parseFloat(compareValue);
  
        // Check if the conversion is successful (not NaN)
        if (!isNaN(doubleValue)) {
            arrayType.push(doubleValue);
            // console.log(arrayType)
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
        _errors: [],
        
        // SETTINGS 
        fileSettings:{},
        dropdownSettings:{},
        emailSettings:{},
        textSettings:{},
        // END SETTING

        patternRegExp:null,
        
        // onShowNoti: function (message) {
        //   $notification({text:message,variant:'warning',position:'center-top',duration:3000})
        // },
        
         getrealJson(jsonData_){
          // console.log(this.jsonData)
          },


        noSubmit(){
          // alert('no suvmits')
       
        },
        // async submitForm() {
        //   console.log(this.allInputFields);
        
        //   await Promise.all(this.allInputFields.map(async (field) => {
        //     if (field.substring(0, 6).toLowerCase() === 'header') {
        //       // Handle header case
        //     } else {
        //       this.submitForm_ = true;
        
        //       const clickClass = document.querySelectorAll(`.${field}`);
        
        //       if (clickClass.length > 0) {
        //         await Promise.all(Array.from(clickClass).map(clickClass_ => {
        //           return new Promise(resolve => {
        //             clickClass_.click();
        //             resolve();
        //           });
        //         }));
        
        //         // Code after the forEach loop is complete
        //         console.log('+++++++++++++++++++++++++++++++');
              
        //       } else {
        //         console.error(`Buttons inside .${field} not found.`);
        //       }
        //     }
        //   }));

        //   console.log(this._errors)
        // },
        
        repliesToJson(_errors){
          if ((_errors).every(element => element === false)) {
            // Do something if all elements are false
            console.log('All elements are not false.');
          } else {
            
            const replies = { 
              formReplies: {}, 
            }
            replies.formReplies[this.pageKey] = {};
          
            this.allInputFields.forEach(field => {
              
              const spanAbove = document.querySelector(`.Name${field}`);
              const fieldValue = document.querySelector(`.${field}`);
              if(fieldValue.value === 'file'){
                
              }

              // let spanAbove = (inputElement.previousElementSibling).innerText;
    
              const fields = {
               fieldName: spanAbove.innerText,
               fieldValue: fieldValue.value
                // Add more mappings as needed
              };
               // Push fields into replies.formReplies[this.pageKey]
                replies.formReplies[this.pageKey][field] = fields;
              
            })
            
            console.log(replies)

            // SEND FILE DATA TO DATABASE
            // FIRST PROCESS IMAGE

          }
        },
        async submitForm() {
          // LOOP THROGH ALL THE FIELDS AND SAVE TRIGGER THE VALIDATION
          // if all fields validation is passed, save the data
          console.log(this.allInputFields)
          let promises = [];
          this.allInputFields.forEach(field => {
            if ((field).substring(0, 6).toLowerCase() === 'header') {
              // Do not include header fields in the loop
            } else {
              // set this.submitForm_ = true to enable auto clicking to verify each input and select fields
              this.submitForm_ = true;
              const clickClass = document.querySelectorAll(`.${field}`);
              console.log(clickClass.value)
              if (clickClass) {
                for (const clickClass_ of clickClass) {
                  promises.push(new Promise(resolve => {
                    clickClass_.click();
                    resolve();
                  }));
                }
              } else {
                console.error("Button inside #button1 not found.");
              }
            }
          });
        
          // Wait for all of the promises to resolve before logging the message to the console
          await Promise.all(promises);
          console.log('+++++++++++++++++++++++++++++++');
          console.log(this._errors)

          repliesToJson(this.errors)
        },      

        checkSettings(eachFieldSetting, fieldValue, errors, submit = null){
          // CHECK AND VALIDAT ALL SETTINGS FOR EVERY INPUT FIELD
          // DONT FORGET TO USE PAGEKEY FOR THE SETTINGS OBJECT
          // _keyComb is a globally accssible keyComb

          console.log('@@@@@@@@@@@@')
          console.log(eachFieldSetting[this._keyComb])
          
          let required =''
          let addField = ''
          let validPattern = ''

          // [[[[[[[[[[[[[      REQUIRED VALIDATION      ]]]]]]]]]]]]] 

          let foundRequired = (eachFieldSetting[this._keyComb] || []).find(item => item.hasOwnProperty("Required"));
            if (foundRequired) {
                required = foundRequired["Required"];
                if(required == 'on'){
                  if(this.inputValue !== ''){
                    errors.validation = false    
                    this._errors.push(false) 
                  }else{
                    errors.validation = true
                    this._errors.push(true)
                    errors.message=`<li>This field cannot be empty</li>`
                    this.submitForm_ = false // disable clicking on input
                    // Notification.click();
                    // this.$notification({text:'Error: you left some fields empty',variant:'error',position:'borrom-right',duration:3000})
                    return
                    
                  }
                }else{
                  errors.validation = false 
                  this._errors.push(false)
                  // errors.message=`<li>This field cannot be empty</li>`      
                }
            }

           // [[[[[[[[[[[[[      PATTREN VALIDATION      ]]]]]]]]]]]]] 
        
          let foundAddField = (eachFieldSetting[this._keyComb] || []).find(item => item.hasOwnProperty("Add field value to the front of the file name"));
            if (foundAddField) {
              addField = foundAddField["Add field value to the front of the file name"];
            }

          let foundValidPattern = (eachFieldSetting[this._keyComb] || []).find(item => item.hasOwnProperty("Validation Pattern"));
            if (foundValidPattern) {
              validPattern = foundValidPattern["Validation Pattern"];
              console.log(validPattern)
              if (/^\/[^/]/.test(validPattern)) {
                // If there is only one slash, add another
                validPattern = '/' + validPattern;
              }
              console.log('this is the valid pattern',validPattern)
              // console.log(errors)              
              
              try {
                this.patternRegExp = new RegExp(validPattern);
                // console.log(this.patternRegExp)
               
                if (this.patternRegExp.test(this.inputValue)) {
                  console.log('Input matches the pattern.');
                  errors.validation = false     
                  this._errors.push(false)
                
                } else {
                  errors.validation = true
                  this._errors.push(true)
                  errors.message=`<li>the this field is invalid</li>`
                    console.log('Input does not match the pattern.');
                    this.submitForm_ = false // disable clicking on input
                    this.$notification({text:'Error: certain fields are not valid',variant:'error',position:'right-bottom',duration:3000})
                    return
                }
              } 
              catch (error) {
                  console.error('Error creating regular expression:', error.message);
              }
           
            }

          if(required !== '' && required == 'on' ){
            console.log(fieldValue.replace(/\s/g, '')+this._keyComb)
            console.log(this.inputValue)
          }

          
          
        },
        checkFor(index,conditionField,arr1,arr2,arr3){

         
          let keyComb = `${this.pageKey}${this.fieldKey}`
          
          if(arr1[index-1] !== '' && arr2[index-1] !== '' && (arr3[index-1] !== '' && arr3[index-1] !== undefined)){
            const parm1 = arr1[index-1] // add page key to diffeneitiae the pontfield
            const operand = arr2[index-1]
            const parm3 = arr3[index-1]
            const condition = `"${parm1}" ${operand} ${parm3}`;
            // console.log(condition)
        
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

            // console.log('conditionsTest')
            // console.log(this.conditionsTest)

          }else{
            // alert('no')
          }
          // console.log(this.completeCondition)
          // console.log(this._if)
        
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
          // console.log('=======================')
          // console.log(this.conditionsTest)
          
          this.showLabel = !this.showLabel
          return
        // check complete condition to see if this field showlabel has been updated
        },
        autoClickClass(conditionField) {
          // console.log(conditionField)
          const clickClass = document.querySelectorAll(`.${conditionField}`);
          // console.log(clickClass)
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
          // console.log() console.log('MONOA',this._conditionsWord)
          let _if 
          this.conditionPointer
        
          //console.log(this.conditionsTest)
          //console.log(fieldValue.replace(/\s/g, ''))
          const foundItems = this.conditionsTest.filter(item => item.pointField === fieldValue.replace(/\s/g, ''));

         //console.log(foundItems)
         
          if (foundItems.length > 0) {
            //  console.log('Item found:', foundItems);
            //  console.log('in:', this.conditionsTest);
             foundItems.forEach(foundItem => {
              const newParam1 = this.inputValue;
              const operand = foundItem.condition.operand;
              const param3 = foundItem.condition.param3;
              let finalCondition = ''

              console.log(foundItems)
              // CHECK OPERAND TYPES AGAIN
              // NOTE: in pushConditionWithSymbol we converted the words to symbol, not relevant tho but still we did
              // We didnt include checked and not_checked as this form builder has no need for it YET
              // The else condition condtains evrything else that the symbol can comfortably hole like >,<,===, etc.
         
              if(operand == `=== ""`){
                  finalCondition = `"${newParam1}" ${operand} `; 
                  // alert(finalCondition)
              }else if(operand == `!== ""`){
                finalCondition = `${newParam1} ${operand} `;
                // alert(finalCondition)
              }else if(operand == `.includes`){
                finalCondition = `${newParam1} ${operand} `;
                // alert(finalCondition)
              }else if(operand == `!.includes`){
                finalCondition = `!${newParam1}.includes`;
                // alert(finalCondition)
              }else{
              if (typeof param3 === "string") {
                finalCondition = `"${newParam1}" ${operand} "${param3}"`;
              } else if (typeof param3 === "number" && typeof newParam1 === "number") {
                finalCondition = `${newParam1} ${operand} ${param3}`;
              }else if (typeof param3 === "number" && typeof newParam1 === "string") {
                finalCondition = `"${newParam1}" ${operand} "${param3}"`;
              }
             }
             // END this

              console.log(finalCondition)
              foundItem.status = eval(finalCondition)
            
              if (eval(finalCondition)) {
               
                // this completeCondition push is almost not necessary and not used in this code
                  this.completeCondition.push(true);
              } else {
                  // console.log('not greater');
                
                  this.completeCondition.push(false);
              }
          
              // Filter the array based on the conditionField
              const filteredArray = this.conditionsTest.filter(item => item.conditionField === foundItem.conditionField);

              // Get the length of the filtered array
              const lengthOfCurrentConditionTest = filteredArray.length;

              // GET THE IF 'ALL' OR 'ANY ' CONDITION OF THE CODITION FIELD
              const conditionFieldIF = document.querySelector(`.${foundItem.conditionField}`);
             
              
              if (conditionFieldIF) {
                _if = conditionFieldIF.value
              } else {
                _if = 'none'
              }
              // Check if that is all the conditions there is in this system
              if(foundItems.length < lengthOfCurrentConditionTest){
                  // console.log(this.conditionsTest)
                  // console.log('more condtions are to be met')



                  // Now we have to check the conditionField, and process its own condition
                  if ((_if).toLowerCase() == 'all') {  
                    // console.log('This is ALL')                
                    // Check if every condition has a matching conditionField and the status is true
                    const allConditionsTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .every(item => item.status === true);
                    // console.log('every condition matches',allConditionsTrue, foundItem.conditionField)
                    if(allConditionsTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                     }else{ 
                      // console.log('not all match')
                    }
                   // this.showLabel = allConditionsTrue
                    // Add logic for the case when all conditions are met
                  }
                  if ((_if).toLowerCase() == 'any') {
                    // console.log('This is ANY')
                    const anyConditionTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .some(item => item.status === true);
                    // console.log('ANY condition matches',anyConditionTrue)
                    
                    if(anyConditionTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                    }else{ 
                      // console.log('not all match')
                    }

                  }
              }else{
                    // console.log('no more')
                  if ((_if).toLowerCase() == 'any') {
                    // console.log('This is ANY')
                    const anyConditionTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .some(item => item.status === true); 
                    // console.log('ANY condition matches',anyConditionTrue, foundItem.conditionField)
                    if(anyConditionTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                    }else{ console.log('not all match')}
                  }
                  if ((_if).toLowerCase() == 'all') {  
                    // console.log('This is ALL')                
                    // Check if every condition has a matching conditionField and the status is true
                    const allConditionsTrue = this.conditionsTest
                    .filter(item => item.conditionField === foundItem.conditionField)
                    .every(item => item.status === true);
                    // console.log('every condition matches',allConditionsTrue, foundItem.conditionField)
                    if(allConditionsTrue){                             
                      this.autoClickClass(foundItem.conditionField) 
                    }else{ 
                      // console.log('not all match')
                    }
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
