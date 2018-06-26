# Notes

## How ro conver .cjsx to jsx 

```
npm install -g depercolate
depercolate open-dialog.cjsx

```

## Convert coffee to .js by decofenate
[use this](https://github.com/decaffeinate/decaffeinate)


## Using this inside $(ajax)
```
let $this = this;
```

## The following bug was corrected
value.substr(0, 400)

```
value.toString().substr(0, 400)
```

## The following code was added

```
handleLoadUrl(e) {
    if (!(this.state.fhirUrl.length > 2)) {
      return;
    }
    let $this = this;
      $.get(this.state.fhirUrl, function(data, status){
          $this.loadTextResource(JSON.stringify(data));
      });
    State.trigger("load_url_resource", this.state.fhirUrl);
    return e.preventDefault();
  }

```