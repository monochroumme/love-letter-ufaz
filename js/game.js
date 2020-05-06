$(document).ready(function(){
    let inputs = [], players = [];

    inputs=  $('.playerContentTopContent input').toArray();
    players =   $('.playerContentTopContent').toArray();

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