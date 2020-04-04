$(document).ready(function () {
    $("#text").change(function() {
        if (!/^https?:\/\//.test(this.value)) {
            this.value = "http://" + this.value;
        }
    });
});

