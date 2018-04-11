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
        $scope.acesso = [];
        $scope.datahoraOrigin = []; //para colocar no input type date
        $scope.nomeAlterado = [];
        //inicialização de um usuário vazio
        $scope.usuario = { usuario: '', mensagem: '' /*, datahora: '' */ };

        //método para adicionar o usuário a lista
        $scope.enviarMensagem = function () {            
            var txtUsuario = $scope.acesso.usuario;
            var txtMensagem = $('#mensagem').val();

            if (txtMensagem == '') {
                mostraFeed('alert', 'Digite uma mensagem para enviar!');
            } else {
                salvar(txtUsuario);//funcao do main.js para fazer a inserção no firebase
                $scope.chat = [];
                $scope.atualizar();
                document.getElementById('mensagem').value = "";//apaga o campo de texto após enviar a msg
            }
        };

        //método para acessar o sistema
        $scope.entrarSistema = function () {
            var txtAcessoUser = $('#txtAcessoUser').val();
            var txtAcessoPass = $('#txtAcessoPass').val();
            document.getElementById('idUser').textContent = txtAcessoUser;//setando o nome do usuário no titulo

            if (txtAcessoUser == '' || txtAcessoPass == '') {
                mostraFeed('alert', 'Preenchar todos os campos para adicionar usuario!');
            } else {
                let encontrouUser = false;//variavel para se o usuario e senha estiverem salvos no bd
                // Definindo a referência com a qual trabalharemos: "text"
                var textRef = firebase.database().ref('acesso');
                // "Escutando" toda e qualquer alteração da chave "text"
                textRef.once('value', function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var value = childSnapshot.val();
                        if (value.usuario == txtAcessoUser && value.senha == txtAcessoPass) {
                            $scope.acesso = { usuario: txtAcessoUser };
                            encontrouUser = true;
                            acessar();//funcao do main.js
                            carregarChat();
                        }
                    })
                    //se encontrar o usuario mostra o feed de bem vindo, senao, mostra o de usuario incorreto
                    if(encontrouUser){
                        mostraFeed('success', 'Bem vindo ' + txtAcessoUser + '!');

                    }else{
                        mostraFeed('error', 'Usuário ou Senha incorretos!');
                    }
                })
            }
        }
        
        //metodo para acessa tela de novo usuario
        $scope.acessarTelaNovoUsuario = function () {
            $('#formLogin').hide();
            $('#formRegister').show();
        }

        //metodo para registrar um novo usuario
        $scope.registrarUsuario = function () {
            var txtNewUser = $('#txtNewUser').val();
            var txtNewPass = $('#txtNewPass').val();

            if (txtNewUser == '' || txtNewPass == '') {
                mostraFeed('alert', 'Preencha todos os campos para adicionar um novo usuário!');
            } else {
                salvarNovoUsuario();//funcao do main.js para fazer a inserção no firebase
            }

        }

        //funcoes para esconder e mostra loading e tabela
        $scope.mostrarTabela = function () {
            $('#divCarregando').fadeOut();
            $('#containerTabela').fadeIn();
        };
        $scope.esconderTabela = function () {
            $('#divCarregando').show();
            $('#containerTabela').hide();
        };

        var textRef = firebase.database().ref('chat');
        var contador = 0;

        //método para buscar do BD firebase e popular a tabela
        $scope.atualizar = function () {
            $scope.esconderTabela();
            // Definindo a referência com a qual trabalharemos: "text"
            // "Escutando" toda e qualquer alteração da chave "text"
            textRef.once('value', function (snapshot) {
                contador = snapshot.numChildren();
                snapshot.forEach(function (childSnapshot) {
                    var value = childSnapshot.val();

                    //formantando datahora
                    var datahoraAtt = new Date(value.datahora);
                    var dayAtt = datahoraAtt.getDate();
                    dayAtt = ("00" + dayAtt).slice(-2);
                    var monthAtt = datahoraAtt.getMonth() + 1;
                    monthAtt = ("00" + monthAtt).slice(-2);
                    var yearAtt = datahoraAtt.getFullYear();
                    yearAtt = ("00" + yearAtt).slice(-4);
                    var horas = ("00" + datahoraAtt.getHours()).slice(-2);
                    var minutos = ("00" + datahoraAtt.getMinutes()).slice(-2);

                    var datahoraFinalAtt = dayAtt + "-" + monthAtt + "  " + horas + ":" + minutos;

                    $scope.usuario = { usuario: value.usuario, mensagem: value.mensagem, datahora: datahoraFinalAtt };
                    $scope.chat.push($scope.usuario);
                });
                $scope.mostrarTabela();
                $scope.$apply();
            });
            goToDown();
        };

        function carregarChat() {
            setInterval(function () {
                textRef.once('value', function (snapshot) {

                    if (snapshot.numChildren() > contador) {
                        console.log("mandar atualizar");

                         var value = snapshot.child(contador).val();
                         console.log(value)

                        //   //formantando datahora
                        //   var datahoraAtt = new Date(value.datahora);
                        //   var dayAtt = datahoraAtt.getDate() + 1;
                        //   dayAtt = ("00" + dayAtt).slice(-2);
                        //   var monthAtt = datahoraAtt.getMonth() + 1;
                        //   monthAtt = ("00" + monthAtt).slice(-2);
                        //   var yearAtt = datahoraAtt.getFullYear();
                        //   yearAtt = ("00" + yearAtt).slice(-4);
                        //   var horas = ("00" + datahoraAtt.getHours()).slice(-2);
                        //   var minutos = ("00" + datahoraAtt.getMinutes()).slice(-2);

                        //   var datahoraFinalAtt = dayAtt + "-" + monthAtt + "  " + horas + ":" + minutos;

                        //   $scope.usuario = { usuario: value.usuario, mensagem: value.mensagem, datahora: datahoraFinalAtt };
                        //   $scope.chat.push($scope.usuario);
                        $scope.chat = [];
                        $scope.atualizar();
                    }
                })
            }, 1000)
            $scope.chat = [];
            $scope.atualizar();

        }
        $scope.mostrarTabela();
    })
