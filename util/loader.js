

export default class Loader
{
  constructor()
  {

  }

  load(url, fn)
  {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            fn(myArr);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }


}
