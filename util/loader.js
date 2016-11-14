

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
            var json = JSON.parse(this.responseText);
            fn(json);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }


}
