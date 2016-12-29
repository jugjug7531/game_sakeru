enchant();

//ゲームで使用する画像
var PLAYER_IMG = './image/chara1.png';
var ENEMY_IMG = './image/monster.png';
var TITLE_IMG = './image/title.png';
var GAMEOVER_IMG = './image/gameover.png'
var SOUSA_IMG = './image/sousa.png'
var ITEM_IMG = './image/icon0.png'
var GAMECLEAR_IMG = './image/allClear.png'

var IMG = [PLAYER_IMG, ENEMY_IMG, TITLE_IMG, GAMEOVER_IMG, SOUSA_IMG, ITEM_IMG, GAMECLEAR_IMG];
//アイテムを何個取ればクリアにするか決める
var clearNumber = 5;
//敵の出現頻度(0~100)
var appearLevel = 10;
//敵のMaxスピード
var enemySpeed = 8;
//全体のステージ数および現在のステージ数
var allStageNumber = 3;
var stageNumber = 1;
//各ステージの難易度調整
var Difficulty = [];
var difficulty　=　function(){
  this.clearNumber = 0;
  this.appearLevel = 0;
  this.enemySpeed = 0;
}
for (var i = 0; i < allStageNumber; i++) {
  Difficulty[i] = new difficulty();
}
  //ステージ１
  Difficulty[0].clearNumber = 5;
  Difficulty[0].appearLevel = 5;
  Difficulty[0].enemySpeed = 5;
  //ステージ2
  Difficulty[1].clearNumber = 6;
  Difficulty[1].appearLevel = 8;
  Difficulty[1].enemySpeed = 7;
  //ステージ3
  Difficulty[2].clearNumber = 7;
  Difficulty[2].appearLevel = 12;
  Difficulty[2].enemySpeed = 10;

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
      var startButton = new Button("Play!", "light");
      startButton.moveTo(120,180);
      gameStartScene.addChild(startButton);
      // ボタンを押したらゲームシーンに置き換える
      startButton.ontouchstart = function(){
        core.replaceScene(nextStageScene(1, Difficulty[0].clearNumber));
      }

      return gameStartScene;
    };

    //ゲームシーンを作り、返す関数
    var createGameScene = function(clearNumber, appearLevel, enemySpeed){ //敵の出現頻度&速度を引数にとるようにする
        //ゲーム画面の背景設定
        var scene = new Scene();
        scene.backgroundColor = '#f0f0f0'
        //主人公
        var bear = new Sprite(32, 32);
        bear.image = core.assets[PLAYER_IMG];
        bear.x = 10;
        bear.y = 20;
        scene.addChild(bear);
        //敵
        var Enemy = Class.create(Sprite, {
          initialize: function(y){
            Sprite.call(this, 32, 15);
            this.image = core.assets[ENEMY_IMG];
            this.x = 320;
            this.y = y;
            scene.addChild(this);
          }
        });
        //アイテム
        var Item = Class.create(Sprite, {
          initialize: function(){
            Sprite.call(this, 16, 16);
            this.image = core.assets[ITEM_IMG];
            this.frame = 30;
            this.x = rand(170) + 30;
            this.y = rand(280) + 20;
            scene.addChild(this);
          }
        });

        //経過時間の表示
        var label = new Label();
        label.x = 240;
        label.y = 5;
        label.color = 'red';
        label.font = '14px "Arial"';
        var time = 0;
        label.on('enterframe', function() {
          //秒数表示
          time += 1 / core.fps;
          label.text = "Time:" + (60.0 - time).toFixed(1);
        })
        scene.addChild(label);
        //獲得したアイテムの個数表示
        var getLabel = new Label();
        getLabel.x = 240;
        getLabel.y = 20;
        getLabel.color = 'DarkOrange';
        getLabel.font = '14px "Arial"';
        getLabel.text = "Star:" + 0 + "/" + clearNumber;
        scene.addChild(getLabel);
        //現在のステージ数を表示
        var stageLabel = new Label();
        stageLabel.x = 5;
        stageLabel.y = 5;
        stageLabel.color = 'black';
        stageLabel.font = '14px "Arial"';
        stageLabel.text = "Stage:" + stageNumber;
        scene.addChild(stageLabel);
        //アイテムを獲得したときに文字を表示
        var itemLabel = new Label("Get!");
        itemLabel.color = 'DarkOrange';
        itemLabel.font = '14px "Arial"';
        itemLabel.visible = false;
        scene.addChild(itemLabel);
        //アイテムをあらかじめ配列に格納
        var items = [];
        var count = 0;
        for (var i = 0; i < clearNumber; i++) {
          items[i] = new Item();
          items[i].visible = false;
        }
        //最初のアイテムはゲーム開始3秒後に表示
        setTimeout(function(){
          items[0].visible = true;
        }, 3000);
        //ゲーム画面のイベントリスナー
        var j = 0;
        var flag = true;
        scene.addEventListener('enterframe', function() {
          //時間切れかどうか判定
          timeUpIf(time);
          //アイテムをゲットできたかどうか判定
          if (hitItemIf(items, items[count], bear, count, clearNumber, stageNumber, flag)) {
            //次のアイテムが出現するまでアイテムゲット判定をおこなわない
            flag = false;
            //アイテムゲットラベルを表示
            itemLabel.x = bear.x + 10;
            itemLabel.y = bear.y - 10;
            itemLabel.visible = true;
            //アイテムゲットラベルを2秒後に消す
            setTimeout(function(){
              itemLabel.visible = false;
            }, 2000);
            count++;
            getLabel.text = "Star:" + count + "/" + clearNumber;
            //次のアイテムを2秒後に表示する
            setTimeout(function(){
              flag = true;
              items[count].visible = true;
            }, 2000);
          }

          //敵の生成条件
          var enemys = [];
          if(rand(100) < appearLevel) {
            //敵を格納する配列
            enemys[j] = new Enemy(rand(300));
            //敵の進み方
            enemys[j].on('enterframe', function() {
              this.x -= rand(enemySpeed);
              if (this.x <= -30) this.remove();
              //衝突判定
              hitEnemyIf(this, bear);
            });
            j++;
          };
        })

        //時間切れを判定する関数
        function timeUpIf(time){
          if (time > 60) core.replaceScene(createTimeoverScene());
        }

        //敵との衝突判定をおこなう関数
        function hitEnemyIf(enemy, obj) {
          //もし衝突したら生き延びた時間をゲームオーバシーンに渡して画面遷移
          if (enemy.intersect(obj)) {
            core.replaceScene(createGameoverScene(count, clearNumber));
          }
        }

        //アイテムとの衝突判定をおこなう関数
        function hitItemIf(items, item, obj, count, clearNumber, stageNumber, flag) {
          //次のアイテムが表示されてから判定する
          if (flag == true) {
            //ステージクリア条件の個数をゲットしたとき
            if (item.intersect(obj) && count >= (clearNumber - 1)) {
              if (stageNumber == allStageNumber) {
                core.replaceScene(createGameAllClearScene());
              } else {
                count = 0;
                core.replaceScene(createGameClearScene());
              }
            //ゲットしたけど5個未満のとき
            }else if (item.intersect(obj)) {
              item.remove();
              return true;
            }
          }
        }

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

        return scene;
      };

    //ゲームクリアシーンを作り、返す関数
    var createGameClearScene = function() {
      //ゲームクリア画面
      var scene = new Scene();
      scene.backgroundColor = 'skyblue';
      //ゲームクリアの文字をを表示
      var clearLabel = new Label("You did it!");
      clearLabel.color = 'black'
      clearLabel.font = '32px "Chalkboard"';
      clearLabel.x = 75;
      clearLabel.y = 80;
      scene.addChild(clearLabel);
      //nextボタン
      var button = new Button("Next stage!");
      button.moveTo(100,180);
      scene.addChild(button);
      //ボタンを押したら次のステージシーンに置き換える
      button.ontouchstart = function(){
        stageNumber += 1;
        core.replaceScene(nextStageScene(stageNumber, Difficulty[stageNumber-1].clearNumber));
      }
      return scene;
    };

    //ステージスタート前のシーンを作り、返す関数
    var nextStageScene = function(stageNumber, clearNumber) {
      //ステージスタート前の画面
      var scene = new Scene();
      //次のステージ数を表示
      var label = new Label("Stage:" + (stageNumber) );
      label.font = '20px "Arial"';
      label.x = 40;
      label.y = 70;
      scene.addChild(label);
      //ステージクリア条件を表示
      var clearlabel = new Label("Goal: Get " + clearNumber + " stars" );
      clearlabel.color = 'red'
      clearlabel.font = '20px "Arial"';
      clearlabel.x = 70;
      clearlabel.y = 120;
      scene.addChild(clearlabel);
      //nextボタン
      var button = new Button("Start!");
      button.moveTo(120,180);
      scene.addChild(button);
      //ボタンを押したら次のステージシーンに置き換える
      button.ontouchstart = function(){
        core.replaceScene(createGameScene(Difficulty[stageNumber-1].clearNumber, Difficulty[stageNumber-1].appearLevel, Difficulty[stageNumber-1].enemySpeed));
      };
      return scene;
    };

    //ゲームオーバーシーンを作り、返す関数
    var createGameoverScene = function(count, clearNumber) {
    //ゲームオーバー画面
      var gameOverScene = new Scene();
      gameOverScene.backgroundColor = 'darkgray';
      //ゲームオーバーの文字表示
      var gameOverLabel = new Sprite(220, 90);
      gameOverLabel.image = core.assets[GAMEOVER_IMG];
      gameOverLabel.x = 40;
      gameOverLabel.y = 70;
      gameOverScene.addChild(gameOverLabel);
      //獲得できたアイテムの個数を表示
      var gettedItem = new Label();
      gettedItem.x = 90;
      gettedItem.y = 145;
      gettedItem.text = "[Result] Star:" + count + "/" + clearNumber;
      gameOverScene.addChild(gettedItem);
      //リトライボタン
      var button = new Button("Retry");
      button.moveTo(120,180);
      gameOverScene.addChild(button);
      //ボタンを押したらスタートシーンに置き換える
      button.ontouchstart = function(){
        core.replaceScene(nextStageScene(stageNumber, Difficulty[stageNumber-1].clearNumber));
      }

      return gameOverScene;
    };

    //タイムオーバーシーンを作り、返す関数
    var createTimeoverScene = function() {
      //ゲームオーバー画面
      var scene = new Scene();
      scene.backgroundColor = 'darkgray';
      //タイムオーバーの文字を表示
      var label = new Label("Time over!");
      label.color = 'red';
      label.font = '32px "Arial"';
      label.x = 80;
      label.y = 80;
      scene.addChild(label);
      //リトライボタン
      var button = new Button("Retry");
      button.moveTo(120,180);
      scene.addChild(button);
      //ボタンを押したらスタートシーンに置き換える
      button.ontouchstart = function(){
        core.replaceScene(nextStageScene(stageNumber, Difficulty[stageNumber-1].clearNumber));
      }

      return scene;
    };

    //全ステージクリア後のシーン
    var createGameAllClearScene = function(){
      var scene = new Scene();
      scene.backgroundColor = 'gold';
      //全ステージクリアおめでとうの文字
      var label = new Label("Congratulations!")
      label.color = 'black';
      label.font = '32px "Chalkboard"';
      label.x = 40;
      label.y = 70;
      scene.addChild(label);
      //全ステージクリアおめでとうの文字
      var thankyouLabel = new Label("Thank you for playing!")
      thankyouLabel.color = 'black';
      thankyouLabel.font = '14px "Chalkboard"';
      thankyouLabel.x = 85;
      thankyouLabel.y = 130;
      scene.addChild(thankyouLabel);
      //タイトル画面に戻るボタン
      var button = new Button("Play again!");
      button.moveTo(105,180);
      scene.addChild(button);
      //ボタンを押したらスタートシーンに置き換える
      button.ontouchstart = function(){
        stageNumber = 1;
        core.replaceScene(createStartScene());
      }

      return scene;
    }


    //0からnまでの乱数を生成する関数
    function rand(n) {
      return Math.floor(Math.random() * (n+1));
    }

    core.replaceScene(createStartScene());
  }

  core.start();
}
