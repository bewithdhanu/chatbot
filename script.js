(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        setLoadingMessage = function (message_side) {
            var $messages, message;
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === '' ? 'right' : message_side;
            message = '<li class="message temp_message '+message_side+' appeared"><div class="avatar"></div><div class="text_wrapper"><div class="text">...</div></div></li>';
            $('.messages').append(message);/*
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);*/
        };
        removeLoadingMessage = function () {
            $(".temp_message").remove();
        };
        removeAllChat = function(){
            $(".messages").html("");
        };
        sendMessage = function (text,message_side) {
            removeLoadingMessage();
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === '' ? 'right' : message_side;
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            if(message_side=="right"){
                $.ajax({
                    url:"server.php",
                    method:"POST",
                    data:{"function":"request","data":text},
                    dataType:"JSON",
                    beforeSend:function(){
                        setTimeout(function () {
                            setLoadingMessage('left');
                        }, 500);
                    },
                    success:function(data){
                        setTimeout(function () {
                            removeLoadingMessage();
                            sendMessage(data['response'],'left');
                            if(data['action']=='c'){
                                removeAllChat();
                            }
                        }, 1000);
                    },
                    error:function(data){
                    }
                });
            }
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            var msg=getMessageText();
            return sendMessage(msg,'right');
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                var msg=getMessageText();
                return sendMessage(msg,'right');
            }
        });
        $.ajax({
            url:"server.php",
            method:"POST",
            data:{"function":"init"},
            dataType:"JSON",
            success:function(data){
                setTimeout(function () {
                    sendMessage(data['response'],'left');
                }, 500);
            },
            error:function(data){
                removeLoadingMessage();
            }
        });
    });
}.call(this));
$( document). on('click',".close",function() {  
    $(".cw").toggle();
});  
$( document). on('click',".minimize",function() {    
    $(".buttons").toggle();
    $(".messages").toggle();
    $(".bottom_wrapper").toggle();
    $(".cw").removeClass("chat_window");
    $(".cw").addClass("chat_window_mini");
    $(".title").html("<i class='fa fa-commenting'></i>");
    $(".top_menu").css("padding" ,"20px 20px 20px 27px");
});
$( document). on('click',".chat_window_mini",function() {
    $(".buttons").toggle();
    $(".messages").toggle();
    $(".bottom_wrapper").toggle();
    $(".cw").removeClass("chat_window_mini");
    $(".cw").addClass("chat_window");
    $(".title").html("Chat Bot");
    $(".top_menu").css("padding" ,"17px 0 15px");
});