$(document).ready(function(){


    // console.log("sa")
    let inputs=[];

    inputs=  $('.playerContentTopContent input').toArray();
    let players=[];
   players =   $('.playerContentTopContent').toArray();

 
    console.log(inputs);
   
    let startGame=$('#start-button');
    $(document).on('click', ' #start-button',function(){
        let names=[];
        for(let i = 0 ; i<inputs.length;i++){
            names[i]=$(inputs[i]).val();
        }
        $('.playerContentTopContent input').remove();
        for(let i = 0 ; i<players.length;i++){
        $(players[i]).append(` <h1>${ names[i] } </h1`);

        }        
        
    })
    
  
 })