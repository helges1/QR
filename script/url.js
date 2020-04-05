$(document).ready(function () {
    $("#text").change(function() {
        if (!/:\/\//.test(this.value)) {
            this.value = "http://" + this.value;
            
        }
        
    });
});

