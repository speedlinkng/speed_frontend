app.component('form-builder', {
    props:{
    } ,
    
    template:
    
    /*html*/
    `
    <div class="place-content-center dark:bg-navy-800 p-2 rounded-md h-fit w-full m-auto left-0 right-0 relative">
        <h3 class="text-center">Your question input</h3>
        <div class="showResult_ p-2 grid grid-cols-1 place-content-center w-[90%]">
            <!-- SHOW INPUT FORM -->
            <div ref="showResult">
            </div>
            <div v-if="showQuestion" class="grid grid-cols-1 gap-2 w-full mt-2 case-prime rounded-lg border border-slate-200 p-3 py-5 dark:border-navy-600">
                <label class="block col-span-2 ">
                    <input
                    v-model="questionText"
                    class="form-input w-full rounded-lg prime bg-slate-150 px-3 py-2 ring-primary/50 placeholder:text-slate-400 hover:bg-slate-200 focus:ring dark:bg-navy-900/90 dark:ring-accent/50 dark:placeholder:text-navy-300 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                    placeholder="Question"
                    type="text"
                    />
                </label>
                
                <label class="inline-flex items-center col-span-2 ">
                    <input
                    v-model="isRequired"
                    class="required-checkbox form-checkbox is-basic h-5 w-5 mr-1 rounded bg-slate-100 border-slate-400/70 checked:!bg-success checked:!border-success hover:!border-success focus:!border-success dark:bg-navy-900 dark:border-navy-500"
                    type="checkbox"
                    />
                    <p>Required</p>
                </label>

                <div>
                    <button @click="addQuest" class="w-fit text-sm btn bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90">
                        Add
                    </button>
                    <button @click="cancel" class="btn ml-2 border text-sm border-error font-medium text-error hover:bg-error hover:text-white focus:bg-error focus:text-white active:bg-error/90">
                        Cancel
                    </button>
        
                </div>
            </div>                
            <!-- Render the dynamically generated HTML using v-html -->
            <div v-for="(input, index) in newInputs" :key="index" v-html="input"></div>
        </div>
        <br>
        <div>
            <div class="flex">
            <button @click="addQ" id="add_question" class="btn text-sm bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover-bg-navy-450 dark:focus-bg-navy-450 dark:active-bg-navy-450/90" v-if="isAddQuestionVisible">
                New Question
            </button>
            <button :disabled="!disableSave" @click="save" class="btn ml-2 text-sm bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover-bg-accent-focus dark:focus-bg-accent-focus dark:active-bg-accent/90">
                Save
            </button>
            </div>
        </div>
    </div>

    `
    ,
    data(){
       return{
          count: 0,
          quest: '',
          question: [],
          show_template:null,
          ans: '',
          addQuestion: 0,
          newInput: null,
          storedInput: '',
          value: '',
          isAddQuestionVisible: true,
          showQuestion:false,
          disableSave:true,
          showQuestion_: [], // Define newInputs as an empty array


          // Data properties for input values
            questionText: '', // Value for the question input
            isRequired: false, // Value for the "Required" checkbox
       }
    },
    methods: {
        save(){
            localStorage.setItem('form-questions', this.quest)
            this.disableSave = true
        },
        onDelete(){
            // this.showQuestion = !this.showQuestion
            // this.isAddQuestionVisible =  !this.isAddQuestionVisible;
        },
        addQ(){
            this.count += 1
            console.log(this.count)
            this.showQuestion = !this.showQuestion
            this.isAddQuestionVisible = false;
             // Push the new input to an array of inputs for rendering
             // this.newInputs.push(this.newInput);
        },
        mounted() {
            // Clear the content inside the ref
            // this.$refs.content.innerHTML = '';
        
           
            
          },
          showQuest(q,r){
            // Create a new div element to hold your question
            const questionContainer = document.createElement('div');
        
            // Set the HTML content of the question container
            questionContainer.innerHTML =
            /*html*/
            `
            <div class="flex mt-2 gap-2 added-prime">
            <p class="p-2">Question </p>
                </div>
                <div class=" added-prime flex items-center justify-between space-x-2 rounded-lg border border-slate-200 p-3 py-5 dark:border-navy-600">
                    <div class="flex items-center space-x-4">
                        <div class="avatar h-12 w-12">
                            <div
                            class="mask is-squircle text-success flex h-14 w-14 items-center font-bold  justify-center bg-success/10"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>                              
                        
                            </div>
                        </div>
                        <div>
                            <p class="font-medium text-lg text-slate-700 dark:text-navy-100">
                              ${q}
                            </p>
                            
                            <p class="mt-0.5 text-xs line-clamp-1 ${(r == 'Required') ? 'text-error': 'text-success'}">
                                ${r}
                            </p>
                        </div>
                    </div>
            
                    <button onclick="onDelete(${r})" class="btn h-9 w-9 p-0 font-medium text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                    
                    
                </div>
            `;
            this.showQuestion_.push(this.show_template);
            let destination = this.$refs.showResult
            destination.appendChild(questionContainer)
            // this.$refs.showResult.appendChild(questionContainer);
            
        },
        addQuest() {

            this.disableSave = false
             
            // Access values from data properties
            const selectedQuestion = this.questionText;
            const isRequired = this.isRequired ? 'Required' : 'Not Required';

            console.log(selectedQuestion)
            console.log(isRequired)

            let value = `${selectedQuestion}-${isRequired}`
            this.quest += (this.addQuestion > 0 ? ', ' : '') + value;
            this.question.push(selectedQuestion);
        
            console.log(this.question)
            console.log(this.quest)
            this.addQuestion++
            this.showQuest(selectedQuestion, isRequired)
                
        }
    }
})