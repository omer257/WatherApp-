/*jshint esnext: true */
class BooksearchClass {
    constructor(cont, tempElem) {
        this.results = JSON.parse(localStorage.getItem("results")) || [];
        this.resultsContainer = cont;
        this.source = tempElem.html();
        this.template = Handlebars.compile(this.source);
        this.LoadingAJax = '<img src="http://bestanimations.com/Animals/Mammals/Dogs/dogs/cute-funny-dog-animated-gif-8.gif">';
        this.noImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png';
        this.noresText = 'No results found';
        this.renderReults();
    }
    handleRes(response) {
        this.resultsContainer.empty();
        var parseData = JSON.parse(response)[0].current;
        var foundIndex = this.results.findIndex((itemX) => {
            return itemX.city === parseData.observationpoint;
        });
        if (foundIndex === -1) {
            this.results.push({
                city: parseData.observationpoint,
                skytext: parseData.skytext,
                temperature: parseData.temperature,
                imageUrl: parseData.imageUrl,
                observationpoint: parseData.observationpoint,
                comments: []
            });
        }
        this.saveToDb();
        this.renderReults();
    }
    getData() {
        this.resultsContainer.empty().html(this.LoadingAJax);
        let item = $("#city").val();
        let url = 'weather?city=' + item; //isbn:
        let that = this;
        $.ajax({
            url: url,
            success: function (data) {
                that.handleRes(data);
            },
            error: function (data) {
                that.handleRes(data);
            }
        });
    }
    getCommentForm(str) {
        var htmlthis = str;
        var inputData = htmlthis.parents('.weatherItem').children('.comment_form').children('.form-group').children('input').val();
        let item = $(this).siblings('.commentInp').val();
        this.results[htmlthis.parents('.weatherItem').index()].comments.push({
            comment: inputData
        });
        this.saveToDb();
        this.renderReults();

    }

    removeRes(str) {
        this.results.splice(str.parents('.weatherItem').index(), 1);
        this.saveToDb();
        this.renderReults();
    }
    removeComment(str) {
        this.results[str.parents('.weatherItem').index()].comments.splice(str.parents('li').index(), 1);
        this.saveToDb();
        this.renderReults();
    }

    saveToDb() {
        //        localStorage.setItem("results", JSON.stringify(this.results));
        $.post( "api", JSON.stringify(this.results) );
        
    }

    renderReults() {
        this.resultsContainer.empty();
        let that = this;
        var results = this.results.sort((a, b) => {
            return a.temperature - b.temperature;
        });
        results.forEach((item) => {
            let newHTML = that.template({
                skytext: item.skytext,
                temperature: item.temperature,
                imageUrl: item.imageUrl,
                observationpoint: item.observationpoint,
                comments: item.comments
            });
            that.resultsContainer.append(newHTML);
        });
    }

}

let myWeatherInst = new BooksearchClass($('.results'), $('#result-template'));
$("#getWeatherForm").submit(() => myWeatherInst.getData());
$('body').on('click', '.commentSend', function () {
    myWeatherInst.getCommentForm($(this));
});
$('body').on('click', '.delete_weather', function () {
    myWeatherInst.removeRes($(this));
});
$('body').on('click', '.deletecomment', function () {
    myWeatherInst.removeComment($(this));
});