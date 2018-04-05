// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .controller('chatController', function ($scope, $http) {
    $scope.chat = [];
    $scope.datahoraOrigin = []; //para colocar no input type date
    $scope.nomeAlterado = [];
    //inicialização de um usuário vazio
    $scope.usuario = { usuario: '', mensagem: '', datahora: '' };

    //método para adicionar o usuário a lista
    $scope.cadastrar = function () {
      var txtNome = $('#usuario').val();
      var txtDesc = $('#mensagem').val();
      var txtdatahora = $('#datahora').val();

      if (txtNome == '' || txtDesc == '' || txtdatahora == "") {
        mostraFeed('alert', 'Preenchar todos os campos para adicionar usuario!');
      } else {
        salvar();//funcao do main.js para fazer a inserção no firebase
        $scope.chat = [];
        $scope.atualizar();
      }
    };

    $scope.deletar = function (nomeusuario) {
      //remover da tabela
      $scope.chat.forEach(function (e) {
        if (e.usuario == nomeusuario) {
          $('#' + nomeusuario).remove();
        }
      });
      remover(nomeusuario);//funcao do main.js para fazer a exclusao no firebase
    };

    $scope.alterar = function (nomeusuario, descusuario, datahoraEntrega) {
      goToTop(); setFocususuario();
      $scope.nomeAlterado = nomeusuario;
      //desabilitando e habilitando botoes
      $('#btnSalvar').removeAttr('disabled');

      $('#btnAdicionar').attr('disabled', '');
      let dtEntrega = '';

      //scope que recebeu do bd o valor correto para passar para o input
      $scope.datahoraOrigin.forEach(function (e) {
        if (e.usuario == nomeusuario) { dtEntrega = e.datahora; }
      });

      //formatando datahora para string
      var datahora = new Date(dtEntrega);
      var day = datahora.getDate() + 1;
      var month = datahora.getMonth() + 1;
      var year = datahora.getFullYear();
      var datahoraFinal = year + "-" + month + "-" + day;

      //recebendo da tabelas os dados para alteracao
      $scope.usuario = { usuario: nomeusuario, mensagem: descusuario, datahora: new Date(datahoraFinal) };

      mostrarCrudusuario();//funcao para mostrar os campos de insercao e alteracao
    };

    $scope.salvarAlteracao = function () {
      var usuario = $('#usuario').val();
      var mensagem = $('#mensagem').val();
      var datahora = $('#datahora').val();
      
      if (usuario == '' || mensagem == '' || datahora == "") {
        mostraFeed('alert', 'Preenchar todos os campos para adicionar usuario!');
      } else {
        update($scope.nomeAlterado);//funcao para update no banco de dados
        let usuario = $scope.nomeAlterado;

        //desabilitando e habilitando botoes
        $('#btnSalvar').attr('disabled', '');
        $('#btnAdicionar').removeAttr('disabled', '');
        $scope.chat = [];
        $scope.atualizar();
      }
    };

    $scope.cancelAlteracao = function (nomeusuario, descusuario, datahoraEntrega) {
      $scope.usuario = { usuario: '', mensagem: '', datahora: '' };
      //desabilitando e habilitando botoes
      $('#btnSalvar').attr('disabled', '');
      $('#btnAdicionar').removeAttr('disabled', '');
      esconderCrudusuario();//funcao para esconder os campos de insercao e alteracao
    };

    //funcoes para esconder e mostra loading e tabela
    $scope.mostrarTabela = function () {
      $('#divCarregando').fadeOut();
      $('#containerTabela').fadeIn();
    };
    $scope.esconderTabela = function () {
      $('#divCarregando').show();
      $('#containerTabela').hide();
    };

    //método para buscar do BD firebase e popular a tabela
    $scope.atualizar = function () {
      $scope.esconderTabela();
      // Definindo a referência com a qual trabalharemos: "text"
      var textRef = firebase.datahorabase().ref('chat');
      // "Escutando" toda e qualquer alteração da chave "text"
      textRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var value = childSnapshot.val();

          //formantando datahora
          var datahoraAtt = new Date(value.datahora);
          var dayAtt = datahoraAtt.getDate() + 1;
          dayAtt = ("00" + dayAtt).slice(-2);
          var monthAtt = datahoraAtt.getMonth() + 1;
          monthAtt = ("00" + monthAtt).slice(-2);
          var yearAtt = datahoraAtt.getFullYear();
          yearAtt = ("00" + yearAtt).slice(-4);

          var datahoraFinalAtt = dayAtt + "-" + monthAtt + "-" + yearAtt;

          $scope.usuario = { usuario: value.usuario, mensagem: value.mensagem, datahora: datahoraFinalAtt };
          $scope.chat.push($scope.usuario);
          $scope.datahoraOrigin.push({ usuario: value.usuario, datahora: value.datahora });
        });
        $scope.mostrarTabela();
        $scope.usuario = { usuario: '', mensagem: '', datahora: '' };
        $scope.$apply();
      });
    };
    $scope.atualizar();



  })
