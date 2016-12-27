enchant();

//ゲームで使用する画像
var PLAYER_IMG = './image/chara1.png';
var ENEMY_IMG = './image/monster.png';
var TITLE_IMG = './image/title.png';
var GAMEOVER_IMG = './image/gameover.png'
var SOUSA_IMG = './image/sousa.png'

var IMG = [PLAYER_IMG, ENEMY_IMG, TITLE_IMG, GAMEOVER_IMG, SOUSA_IMG];

window.onload = function() {

  var core = new Core(320, 320);
  //画像ファイル読み込み
  core.preload(IMG);
  //fps設定
  core.fps = 15;

  core.onload = function() {

    //スタートシーンを作り、返す関数
    var createStartScene = function(){
      //スタート画面
      var gameStartScene = new Scene();
      gameStartScene.backgroundColor = 'white';
      //タイトルの文字
      var gameStartLabel = new Sprite(210, 70);
      gameStartLabel.image = core.assets[TITLE_IMG];
      gameStartLabel.x = 60;
      gameStartLabel.y = 100;
      gameStartScene.addChild(gameStartLabel);
      //操作説明の図
      var gameStartLabel = new Sprite(150, 90);
      gameStartLabel.image = core.assets[SOUSA_IMG];
      gameStartLabel.x = 170;
      gameStartLabel.y = 225;
      gameStartScene.addChild(gameStartLabel);
      //スタートボタン
      var startButton = new Button("Start!", "light");
      startButton.moveTo(120,180);
      gameStartScene.addChild(startButton);
      startButton.ontouchstart = function(){
        // ボタンを押したらゲームシーンに置き換える
          core.replaceScene(createGameScene());
      }
      return gameStartScene;
    };

    //ゲームシーンを作り、返す関数
    var createGameScene = function(){
        //ゲーム画面の背景設定
        var scene = new Scene();
        scene.backgroundColor = '#f0f0f0'
        //主人公
        var bear = new Sprite(32, 32);
        bear.image = core.assets[PLAYER_IMG];
        bear.x = 0;
        bear.y = 0;
        //敵
        var Enemy = Class.create(Sprite, {
          initialize: function(y){
            Sprite.call(this, 32, 32);
            this.x = 350;
            this.y = y;
            this.rotate(-90);
            this.image = core.assets[ENEMY_IMG];
            scene.addChild(this);
          }
        });
        //経過時間の表示
        var label = new Label();
        label.x = 280;
        label.y = 5;
        label.color = 'red';
        label.font = '14px "Arial"';
        var time = 0;
        label.on('enterframe', function() {
          //秒数表示
          time += 1 / core.fps;
          label.text = time.toFixed(2);
        })
        //ゲーム画面のイベントリスナー
        var j = 0;
        scene.addEventListener('enterframe', function() {
          var enemys = [];
          //敵の出現頻度(0~100)
          var appearLevel = 30;
          //敵のMaxスピード
          var enemySpeed = 15;
          //敵の生成条件
          if(rand(100) < appearLevel) {
            console.log(j);
            enemys[j] = new Enemy(rand(300));
            //敵の進み方
            enemys[j].on('enterframe', function() {
              this.x -= rand(enemySpeed);
              if (this.x <= -30) this.remove();
              //衝突判定
              if (this.within(bear, 20)) {
                core.replaceScene(createGameoverScene());
              }
            })
            j++;
          };
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
        //ノード
        scene.addChild(label);
        scene.addChild(bear);
        return scene;
      };

    //ゲームオーバーシーンを作り、返す関数
    var createGameoverScene = function() {
    //ゲームオーバー画面
      var gameOverScene = new Scene();
      gameOverScene.backgroundColor = 'darkgray';
      //ゲームオーバーの文字表示
      var gameOverLabel = new Sprite(220, 90);
      gameOverLabel.image = core.assets[GAMEOVER_IMG];
      gameOverLabel.x = 40;
      gameOverLabel.y = 100;
      gameOverScene.addChild(gameOverLabel);
      //リトライボタン
      var button = new Button("Retry");
      button.moveTo(120,180);
      gameOverScene.addChild(button);
      button.ontouchstart = function(){
        //ボタンを押したらスタートシーンに置き換える
        core.replaceScene(createStartScene());
      }
      return gameOverScene;
    };

    //0からnまでの乱数を生成する関数
    function rand(n) {
      return Math.floor(Math.random() * (n+1));
    }

    core.replaceScene(createStartScene());
  }

  core.start();
}
