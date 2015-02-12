<div id="control" class="play-control">
  status: {{status}}
  <button v-on="click: onPlay" class="control-button control-play">play</button>
  <button v-on="click: onAdd" class="control-button control-add">add</button>
  <button v-on="click: onConnect" class="control-button control-connect">connect</button>
  <button v-on="click: onTest" class="control-button control-connect">test</button>
</div>
<div id="play-list" class="play-list"> 
  <div v-repeat="page" id="play-list-title-{{$index}}" class="play-list-title {{$index === currentPage ? 'current-page' : ''}}" v-on="click: changeSlide($index)">{{header}}</div>
</div>