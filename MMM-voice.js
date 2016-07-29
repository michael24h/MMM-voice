Module.register("MMM-voice",{
    // Default module config.
    defaults: {
        mode : "No mode detected",
        timeout: 15
    },

    start: function(){
        this.pulsing = false;
        this.modules = [];
        Log.log(this.name + ' is started!');
        Log.info(this.name + ' is waiting for voice modules');
    },

    getStyles: function() {
        return ["font-awesome.css", "MMM-voice.css"];
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.classList.add('small');
        var i = document.createElement("i");
        i.setAttribute('id', 'microphone');
        i.classList.add('fa');
        i.classList.add('fa-microphone');
        if(this.pulsing){
            i.classList.add('pulse');
        }
        var mode = document.createElement("span");
        mode.innerHTML = this.config.mode;
        wrapper.appendChild(i);
        wrapper.appendChild(mode);
        return wrapper;
    },

    notificationReceived: function(notification, payload, sender){
        if(notification === 'DOM_OBJECTS_CREATED'){
            this.sendSocketNotification('START', {'timeout': this.config.timeout, 'id': this.config.id, 'modules': this.modules});
        } else if(notification === 'REGISTER_VOICE_MODULE'){
            console.log('REGISTER: %o', payload);
            if(payload.hasOwnProperty('mode')){
                this.modules.push(payload);
            }
        }
    },

    socketNotificationReceived: function(notification, payload){
        if(notification === 'LISTENING'){
            this.pulsing = true;
            this.updateDom();
        } else if(notification === 'SLEEPING'){
            this.pulsing = false;
            this.updateDom();
        } else if(notification === 'ERROR'){
            this.config.mode = notification;
            Log.log('Error: %o', payload);
            this.updateDom();
        } else {
            for(var i = 0; i < this.modules.length; i++){
                if(notification === this.modules[i].mode){
                    this.sendNotification(notification, payload);
                    return;
                }
            }
        }
    }
});