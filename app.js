// Storage Controller 

// Item Controller
const ItemCtrl = (function(){
   // Item Constructor
   const Item = function(id, name, calories){
       this.id=id;
       this.name=name;
       this.calories=calories;

   }
   // data structure / state
   const data = {
       items: [
        //    {id:0, name:'Steak Dinner', calories: 1200},
        //    {id:0, name:'Cookie', calories: 200},
        //    {id:0, name:'Smoothie Bowl', calories: 500}
       ],
       currentItem: null,
       totalCalories: 0
   }
   // public methods
   return {
       getItems: function(){
           return data.items;
       },
       addItem: function(name, calories){
           let ID;
           // create id
           if(data.items.length > 0){
            ID=data.items[data.items.length - 1].id + 1;
           }else{
               ID=0;
           }

           // calories to number
           calories = parseInt(calories)

           // create new item
           newItem = new Item(ID, name, calories);

           // add to items array
           data.items.push(newItem);

           return newItem;
       },
       getTotalCalories: function(){
        let total=0;
        // loop through items and add calories
        data.items.forEach(function(item){
            total += item.calories;
            
        });
        // set total calories in data structure
        data.totalCalories = total
        // return total
        return data.totalCalories;
       },
       logData: function(){
           return data;
       }
   }
})();



// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
   
    //public methods
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html+= `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name} </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>
                </li>`;
            });

            // insert list items 
            document.querySelector(UISelectors.itemList).innerHTML=html;
        },
        getItemInput: function(){
            return{
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create list item element
            const li= document.createElement('li');
            // add class
            li.className='collection-item';
            // add id
            li.id=`item-${item.id}`;
            // add html
            li.innerHTML=`
            <strong>${item.name} </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `;
            // insert item 
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display='none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display='none';
            document.querySelector(UISelectors.deleteBtn).style.display='none';
            document.querySelector(UISelectors.backBtn).style.display='none';
            document.querySelector(UISelectors.addBtn).style.display='inline';

        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();




// App Controller
const App = (function(ItemCtrl, UICtrl){

    // load event listeners
    const loadEventListeners = function(){
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)
    }

    // add item submit
    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();

        // check for name and calorie input
        if(input.name !=='' && input.calories !==''){
            // add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // add item to UI list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // clear fields 
            UICtrl.clearInput();
        }
      

        e.preventDefault();

    }

    // update item submit
    const itemUpdateSubmit = function(e){
        if(e.target.classList.contains('edit-item')){
            console.log('edit item')
        }
        e.preventDefault();
    }
   
    // public methods
    return{
        init: function(){

            // clear edit state / set initial state
            UICtrl.clearEditState();
         
            // fetch items from data structure
            const items= ItemCtrl.getItems();

            // check if any items
            if(items.length===0){
                UICtrl.hideList();
            }else{
            // populate list with items
            UICtrl.populateItemList(items);
            }

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl, UICtrl);

// initialize app
App.init()