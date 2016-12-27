enchant();
//ゲームで使用する画像
var PLAYER_IMG = 'chara1.png';
var ENEMY_IMG = 'monster.png';

var IMG = [PLAYER_IMG, ENEMY_IMG];

window.onload = function() {
  var core = new Core(320, 320);
  //画像ファイル読み込み
  core.preload(IMG);
  //fps設定
  core.fps = 15;
  core.onload = function() {
    var scene = core.rootScene;
    scene.backgroundColor = '#f0f0f0'

    var bear = new Sprite(32, 32);
    bear.image = core.assets['chara1.png'];
    bear.x = 0;
    bear.y = 0;

    var Enemy = Class.create(Sprite, {
      initialize: function(y){
        Sprite.call(this, 32, 32);
        this.x = 350;
        this.y = y;
        this.rotate(-90);
        this.image = core.assets['monster.png'];;

        core.rootScene.addChild(this);
      }
    })
    core.rootScene.addEventListener('enterframe', function() {
      var enemys = [];
      var appearLevel = 30;
      var enemySpeed = 15;
      //敵の生成条件
      if(rand(100) < appearLevel) {
        j = core.frame
        enemys[j] = new Enemy(rand(300));
        //敵の進み方
        enemys[j].on('enterframe', function() {
          this.x -= rand(enemySpeed);
          if (this.x <= -30) this.remove();
      //衝突判定
        if (this.within(bear, 20)) {
          label.text = 'hit!';
          core.pushScene(gameOverScene);
          core.stop();
        }
        })
      };
    })
//ゲームオーバー画面
    var gameOverScene = new Scene();
    gameOverScene.backgroundColor = 'darkgray';
    //ゲームオーバーの文字表示
    var gameOverLabel = new Label('You Died!');
    gameOverLabel.x = 120;
    gameOverLabel.y = 120;
    gameOverLabel.color = 'red';

    gameOverScene.addChild(gameOverLabel);

    //ラベルの表示
    var label = new Label();
    label.x = 280;
    label.y = 5;
    label.color = 'red';
    label.font = '14px "Arial"';
    label.on('enterframe', function() {
      label.text = (core.frame / core.fps).toFixed(2); //秒数表示
    })

    //クマを上下左右に動かす
    var i = 0;
    bear.addEventListener('enterframe', function(){
      if (core.input.left) {
        if (this.x >= 0) {
          this.scaleX = -1;
          this.x -= 5;
          i++;
          this.frame = i % 3;
        } else {
          i++;
          this.frame = i % 3;
        }
      }
      if (core.input.right) {
        if (this.x <= 320 - 32) {
          this.scaleX = 1;
          this.x += 5;
          i++;
          this.frame = i % 3;
        } else {
          i++;
          this.frame = i % 3;
        }
      }
      if (core.input.up) {
        if (this.y >= 0) {
          this.y -= 5;
          i++;
          this.frame = i % 3;
        } else {
          i++;
          this.frame = i % 3;
        }
      }
      if (core.input.down) {
        if (this.y <= 320 - 32) {
          this.y += 5;
          i++;
          this.frame = i % 3;
        } else {
          i++;
          this.frame = i % 3;
        }
      }
    });

    //0~nまでの間で乱数を生成する関数
    function rand(n) {
      return Math.floor(Math.random() * (n+1));
    }

    core.rootScene.addChild(label); //クマの画像を載せる？
    core.rootScene.addChild(bear); //クマの画像を載せる？

  }
  core.start();
}
