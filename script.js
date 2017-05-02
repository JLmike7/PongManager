window.gameOver=true;
window.playerList={
	'mjm':'Michael Marsh',
	'jtp':'John Petro',
	'jtg':'Jordan Good',
	'---':'Guest'
};
$(document).ready(function(){
	$('a.btn.btn-score').on('click',function(e){
		e.preventDefault();
		if(!window.gameOver){
			var scoreInput=$(this).closest('div.team').find('input.score');
			scoreInput.val(fixScore($(scoreInput).val())+1).trigger('keyup');
		}
	});
	$('a.new-game').on('click',function(e){
		e.preventDefault();
		$('input.score').val('');
		$('.player').prop('disabled',false).selectpicker('refresh').selectpicker('val',null);
		showMessage($('span.message'),false);
	});
	$('a.submit-game').on('click',function(e){
		e.preventDefault();
		if(window.invalidGame){
			alert('Invalid Game...');
		}else if(!window.gameOver){
			alert('Game not yet won!');
		} else {
			alert('Coming Soon!');
		}
	});
	$('input.score').on('keyup',function(){
		var oppTeam=$(this).closest('div.team').siblings('div.team');
		var score=fixScore($(this).val());
		var oppScore=fixScore(oppTeam.find('input.score').val());
		var totalScore=score+oppScore;
		var message='';
		var oppMessage='';
		if((score>21||oppScore>21) && Math.abs(score-oppScore)>2){
			message+="Invalid Scores";
			oppMessage+="Invalid Scores";
			window.invalidGame=true;
		}
		else{
			window.invalidGame=false;
			if((totalScore>0&&score<20&&oppScore<20) && totalScore%5==0){
				message+="New Server<br/>";
				oppMessage+="New Server<br/>";
			}
			if(score>20 && score-oppScore>=2){
				message+="WINNER!";
				oppMessage+="Game Lost.";
				window.gameOver=true;
			}else{
				window.gameOver=false;
			}
		}
		showMessage($(this),message);
		showMessage(oppTeam.find('span.message'),oppMessage);
		
		if(totalScore>0){
			$('.player').prop('disabled', true).selectpicker('refresh');
		}
	});
	$('.player').on('changed.bs.select',function(){
		var p1=$('#p1').val()!='';
		var p2=$('#p2').val()!='';
		var p3=$('#p3').val()!='';
		var p4=$('#p4').val()!='';
		if((p1||p2)&&!(p1&&p2)&&(p3||p4)&&!(p3&&p4)){
			window.playerCount=2;
		} else if(p1&&p2&&p3&&p4){
			window.playerCount=4;
		} else{
			window.playerCount=-1;
		}
		
		if(window.playerCount>0){
			window.gameOver=false;
			showMessage($('.message'),'Ready to Play!');
		}else{
			window.gameOver=true;
			if((!p1&&!p2)||(p3&&p4)){
				showMessage($('#p1'),"Not enough players.");
			}else if((!p3&&!p4)||(p1&&p2)){
				showMessage($('#p3'),"Not enough players.");
			}
		}
	});
	$('select.player').html(generateSelectList(window.playerList)).selectpicker({liveSearch:true,title:'Select Player'});
});

function showMessage($el,message){
	if(!$el.hasClass('message'))
		$el=$el.closest('div.team').find('span.message');
	if(message&&message.length>0){
		$el.html(message).show();
	}else{
		$el.hide();
	}
};

function fixScore(score){
		var score=parseInt(score);
		return (isNaN(score)||score<0)?0:score;
};

function generateSelectList(list){
	var r='';
	$.each(list,function(val,title){
		r+='<option value="'+val+'">'+title+'</option>';
	});
	return r;
};