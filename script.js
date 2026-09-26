/* =========================================================
   SCRIPT PRINCIPAL - PROJETO ODS 17 - NOTA 2
   JavaScript, DOM, eventos e Fetch API
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       FUNÇÃO DE MENSAGEM
       ===================================================== */

    function mostrarMensagem(mensagem) {

        const alerta = document.createElement("div");

        alerta.className = "custom-alert";

        alerta.innerHTML = `
            <i class="fa-solid fa-circle-check me-2"></i>
            ${mensagem}
        `;

        document.body.appendChild(alerta);

        setTimeout(function () {
            alerta.remove();
        }, 4000);
    }


    /* =====================================================
       LOGIN
       ===================================================== */

    const loginButton = document.getElementById("openLoginButton");
    const loginModalElement = document.getElementById("loginModal");
    const userLoggedName = document.getElementById("userLoggedName");

    if (loginButton && loginModalElement) {

        loginButton.addEventListener("click", function () {

            if (typeof bootstrap !== "undefined") {

                const modal =
                    bootstrap.Modal.getOrCreateInstance(loginModalElement);

                modal.show();

            } else {

                alert("Não foi possível carregar o componente de login.");
            }
        });
    }


    const loginForm = document.getElementById("loginForm");

    /*
     * LOGIN COM LOCALSTORAGE
     *
     * O cadastro cria uma conta no navegador.
     * O login consulta essa conta e compara e-mail e senha.
     *
     * IMPORTANTE: isto é uma demonstração de front-end para a
     * atividade. Em um sistema real, a autenticação deve ser
     * feita por um backend e as senhas nunca devem ser
     * armazenadas dessa forma.
     */

    const USUARIO_STORAGE = "ods17_usuario";
    const SESSAO_STORAGE = "ods17_sessao";

    function obterUsuario() {

        const dados = localStorage.getItem(USUARIO_STORAGE);

        if (!dados) {
            return null;
        }

        try {
            return JSON.parse(dados);
        } catch (erro) {
            console.error("Erro ao ler o usuário:", erro);
            return null;
        }
    }


    function atualizarBotaoLogin() {

        if (!loginButton) {
            return;
        }

        const sessao = localStorage.getItem(SESSAO_STORAGE);

        if (sessao) {

            const usuario = obterUsuario();
            const nome = usuario ? usuario.nome.split(" ")[0] : "usuário";

            loginButton.innerHTML =
                '<i class="fa-solid fa-right-from-bracket me-1"></i> Sair';

            loginButton.title = "Usuário conectado: " + nome;
            loginButton.dataset.logado = "true";

            if (userLoggedName) {
                userLoggedName.textContent = usuario ? usuario.nome : "Usuário";
                userLoggedName.classList.remove("d-none");
            }

        } else {

            loginButton.innerHTML =
                '<i class="fa-solid fa-right-to-bracket me-1"></i> Entrar';

            loginButton.title = "Entrar na conta";
            loginButton.dataset.logado = "false";

            if (userLoggedName) {
                userLoggedName.textContent = "";
                userLoggedName.classList.add("d-none");
            }
        }
    }


    function encerrarSessao() {

        localStorage.removeItem(SESSAO_STORAGE);

        atualizarBotaoLogin();

        mostrarMensagem("Você saiu da sua conta.");
    }


    if (loginButton && loginModalElement) {

        loginButton.addEventListener("click", function () {

            if (this.dataset.logado === "true") {
                encerrarSessao();
                return;
            }

            if (typeof bootstrap !== "undefined") {

                const modal =
                    bootstrap.Modal.getOrCreateInstance(loginModalElement);

                modal.show();

            } else {

                alert("Não foi possível carregar o componente de login.");
            }
        });
    }


    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();
            const password = document.getElementById("password").value;

            if (email === "" || password === "") {

                alert("Por favor, preencha o e-mail e a senha.");
                return;
            }

            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!emailValido) {

                alert("Digite um endereço de e-mail válido.");
                document.getElementById("email").focus();
                return;
            }

            const usuario = obterUsuario();

            if (!usuario) {

                alert("Nenhuma conta cadastrada. Clique em 'Inscreva-se agora' para criar uma conta.");
                return;
            }

            if (email !== usuario.email || password !== usuario.senha) {

                alert("E-mail ou senha incorretos.");
                return;
            }

            localStorage.setItem(SESSAO_STORAGE, "true");

            mostrarMensagem("Bem-vinda, " + usuario.nome + "! Login realizado com sucesso.");

            loginForm.reset();

            atualizarBotaoLogin();

            if (typeof bootstrap !== "undefined") {

                const modal =
                    bootstrap.Modal.getInstance(loginModalElement);

                if (modal) {
                    modal.hide();
                }
            }
        });
    }


    atualizarBotaoLogin();


    /* =====================================================
       MOSTRAR / OCULTAR SENHA
       ===================================================== */

    const passwordToggle = document.querySelector(".password-toggle");

    if (passwordToggle) {

        passwordToggle.addEventListener("click", function () {

            const passwordInput = document.getElementById("password");
            const icon = this.querySelector("i");

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

                this.setAttribute("aria-label", "Ocultar senha");

            } else {

                passwordInput.type = "password";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

                this.setAttribute("aria-label", "Mostrar senha");
            }
        });
    }


    /* =====================================================
       RECUPERAÇÃO DE SENHA
       ===================================================== */

    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {

        forgotPassword.addEventListener("click", function (event) {

            event.preventDefault();

            const email =
                prompt("Digite seu e-mail para recuperar a senha:");

            if (email === null) {
                return;
            }

            if (email.trim() === "") {

                alert("Digite um endereço de e-mail.");
                return;
            }

            if (!email.includes("@")) {

                alert("Digite um endereço de e-mail válido.");
                return;
            }

            mostrarMensagem(
                "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha."
            );
        });
    }


    /* =====================================================
       CADASTRO
       ===================================================== */

    const registerLink = document.getElementById("registerLink");
    const registerModalElement =
        document.getElementById("registerModal");
    const registerForm =
        document.getElementById("registerForm");
    const voltarLogin =
        document.getElementById("voltarLogin");

    if (registerLink && registerModalElement) {

        registerLink.addEventListener("click", function (event) {

            event.preventDefault();

            if (typeof bootstrap !== "undefined") {

                const loginModalInstance =
                    bootstrap.Modal.getInstance(loginModalElement);

                if (loginModalInstance) {
                    loginModalInstance.hide();
                }

                const registerModal =
                    bootstrap.Modal.getOrCreateInstance(
                        registerModalElement
                    );

                registerModal.show();

            } else {

                alert(
                    "Não foi possível carregar o formulário de cadastro."
                );
            }
        });
    }


    /* =====================================================
       MOSTRAR / OCULTAR SENHA DO CADASTRO
       ===================================================== */

    function configurarVisualizacaoSenha(buttonId, inputId) {

        const button = document.getElementById(buttonId);
        const input = document.getElementById(inputId);

        if (!button || !input) {
            return;
        }

        button.addEventListener("click", function () {

            const icon = this.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

                this.setAttribute(
                    "aria-label",
                    "Ocultar senha"
                );

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

                this.setAttribute(
                    "aria-label",
                    "Mostrar senha"
                );
            }
        });
    }

    configurarVisualizacaoSenha(
        "mostrarSenhaCadastro",
        "senhaCadastro"
    );

    configurarVisualizacaoSenha(
        "mostrarConfirmacaoCadastro",
        "confirmarSenhaCadastro"
    );


    /* =====================================================
       VALIDAÇÃO DO CADASTRO
       ===================================================== */

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const nome =
                document.getElementById("nomeCadastro")
                    .value.trim();

            const email =
                document.getElementById("emailCadastro")
                    .value.trim();

            const senha =
                document.getElementById("senhaCadastro")
                    .value;

            const confirmarSenha =
                document.getElementById(
                    "confirmarSenhaCadastro"
                ).value;

            const mensagem =
                document.getElementById("mensagemCadastro");


            function mostrarErro(texto) {

                mensagem.className =
                    "register-message show error";

                mensagem.innerHTML =
                    '<i class="fa-solid fa-circle-exclamation me-2"></i>' +
                    texto;
            }


            if (nome.length < 3) {

                mostrarErro(
                    "Digite seu nome completo."
                );

                document
                    .getElementById("nomeCadastro")
                    .focus();

                return;
            }


            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!emailValido) {

                mostrarErro(
                    "Digite um endereço de e-mail válido."
                );

                document
                    .getElementById("emailCadastro")
                    .focus();

                return;
            }


            const senhaValida =
                senha.length >= 6 &&
                /[A-Z]/.test(senha) &&
                /[0-9]/.test(senha);

            if (!senhaValida) {

                mostrarErro(
                    "A senha deve ter pelo menos 6 caracteres, uma letra maiúscula e um número."
                );

                document
                    .getElementById("senhaCadastro")
                    .focus();

                return;
            }


            if (senha !== confirmarSenha) {

                mostrarErro(
                    "As senhas não são iguais."
                );

                document
                    .getElementById("confirmarSenhaCadastro")
                    .focus();

                return;
            }


            const usuarioExistente = obterUsuario();

            if (usuarioExistente && usuarioExistente.email === email.toLowerCase()) {

                mostrarErro(
                    "Este e-mail já possui uma conta. Faça login ou use outro e-mail."
                );

                document
                    .getElementById("emailCadastro")
                    .focus();

                return;
            }


            const novoUsuario = {
                nome: nome,
                email: email.toLowerCase(),
                senha: senha
            };

            localStorage.setItem(
                USUARIO_STORAGE,
                JSON.stringify(novoUsuario)
            );

            mensagem.className =
                "register-message show success";

            mensagem.innerHTML =
                '<i class="fa-solid fa-circle-check me-2"></i>' +
                "Cadastro realizado com sucesso!";


            /*
             * Os dados são armazenados no localStorage apenas
             * para demonstrar a interação no front-end.
             */

            setTimeout(function () {

                registerForm.reset();

                mensagem.className =
                    "register-message";

                mensagem.innerHTML = "";

                if (
                    typeof bootstrap !== "undefined" &&
                    registerModalElement
                ) {

                    const registerModal =
                        bootstrap.Modal.getInstance(
                            registerModalElement
                        );

                    if (registerModal) {
                        registerModal.hide();
                    }
                }

                mostrarMensagem(
                    "Conta criada com sucesso! Agora faça login com seu e-mail e senha."
                );

                if (loginModalElement && typeof bootstrap !== "undefined") {
                    const loginModal =
                        bootstrap.Modal.getOrCreateInstance(loginModalElement);
                    loginModal.show();
                }

            }, 1200);
        });
    }


    /* =====================================================
       VOLTAR PARA O LOGIN
       ===================================================== */

    if (voltarLogin) {

        voltarLogin.addEventListener("click", function (event) {

            event.preventDefault();

            if (typeof bootstrap !== "undefined") {

                const registerModal =
                    bootstrap.Modal.getInstance(
                        registerModalElement
                    );

                if (registerModal) {
                    registerModal.hide();
                }

                const loginModal =
                    bootstrap.Modal.getOrCreateInstance(
                        loginModalElement
                    );

                loginModal.show();
            }
        });
    }


    /* =====================================================
       LOGIN SOCIAL
       ===================================================== */

    const socialButtons = document.querySelectorAll(".btn-social");

    socialButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const provider = this.textContent.trim();

            mostrarMensagem(
                "O login com " + provider +
                " será implementado posteriormente."
            );
        });
    });


    /* =====================================================
       FORMULÁRIO DE CONTATO
       ===================================================== */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const email =
                document.getElementById("emailContato").value.trim();
            const assunto =
                document.getElementById("assunto").value.trim();
            const mensagem =
                document.getElementById("mensagem").value.trim();

            if (
                nome === "" ||
                email === "" ||
                assunto === "" ||
                mensagem === ""
            ) {

                alert("Preencha todos os campos antes de enviar.");
                return;
            }

            if (!email.includes("@")) {

                alert("Digite um endereço de e-mail válido.");
                return;
            }

            mostrarMensagem(
                "Mensagem enviada com sucesso! Obrigado pela participação."
            );

            contactForm.reset();
        });
    }


    /* =====================================================
       MENU RESPONSIVO
       ===================================================== */

    const menuLinks =
        document.querySelectorAll("#menuPrincipal .nav-link");

    const menu = document.getElementById("menuPrincipal");

    menuLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                window.innerWidth < 992 &&
                menu.classList.contains("show")
            ) {

                if (typeof bootstrap !== "undefined") {

                    const menuBootstrap =
                        bootstrap.Collapse.getInstance(menu);

                    if (menuBootstrap) {
                        menuBootstrap.hide();
                    }
                }
            }
        });
    });


    /* =====================================================
       API OFICIAL DOS ODS - ONU
       Endpoint: metas do ODS 17
       ===================================================== */

    const API_URL =
        "https://unstats.un.org/SDGAPI/v1/sdg/Goal/";

    const metasApi = document.getElementById("metasApi");
    const statusApi = document.getElementById("statusApi");
    const buscaMeta = document.getElementById("buscaMeta");
    const btnAtualizarMetas =
        document.getElementById("btnAtualizarMetas");

    let metasCarregadas = [];


    function extrairCodigoOds(valor) {

        if (typeof valor !== "string") {
            return null;
        }

        const texto = valor.trim();

        if (!texto) {
            return null;
        }

        const match = texto.match(/(?:ods|goal|objetivo)?\s*(\d{1,2})/i);

        if (!match) {
            return null;
        }

        const codigo = Number(match[1]);

        if (codigo >= 1 && codigo <= 17) {
            return String(codigo);
        }

        return null;
    }


    function atualizarStatus(mensagem, tipo = "normal") {

        if (!statusApi) {
            return;
        }

        statusApi.className = "api-status";

        if (tipo === "erro") {
            statusApi.style.borderLeftColor = "#c0392b";
        }

        if (tipo === "sucesso") {
            statusApi.style.borderLeftColor = "#0b7a4b";
        }

        statusApi.innerHTML = mensagem;
    }


    function extrairMetas(json) {

        /*
         * A API pode retornar os registros dentro de "data"
         * ou diretamente como um array. O tratamento abaixo
         * deixa a aplicação mais resistente a pequenas mudanças
         * no formato da resposta JSON.
         */

        if (Array.isArray(json)) {
            return json;
        }

        if (json && Array.isArray(json.data)) {
            return json.data;
        }

        if (json && Array.isArray(json.results)) {
            return json.results;
        }

        if (json && Array.isArray(json.targets)) {
            return json.targets;
        }

        return [];
    }


    function obterValor(objeto, propriedades, valorPadrao = "") {

        for (const propriedade of propriedades) {

            if (
                objeto &&
                objeto[propriedade] !== undefined &&
                objeto[propriedade] !== null
            ) {
                return objeto[propriedade];
            }
        }

        return valorPadrao;
    }


    async function traduzirTexto(texto, idiomaDestino = "pt") {

        const textoLimpo = String(texto || "").trim();

        if (!textoLimpo) {
            return "";
        }

        try {

            const url =
                "https://api.mymemory.translated.net/get?" +
                "q=" + encodeURIComponent(textoLimpo) +
                "&langpair=en|" + idiomaDestino;

            const resposta = await fetch(url);

            if (!resposta.ok) {
                throw new Error("Falha ao traduzir o texto.");
            }

            const dados = await resposta.json();

            const textoTraduzido =
                dados.responseData?.translatedText ||
                dados.matches?.[0]?.translation ||
                textoLimpo;

            return textoTraduzido;

        } catch (erro) {

            console.warn("Não foi possível traduzir o texto:", erro);
            return textoLimpo;
        }
    }


    async function traduzirMetas(metas) {

        if (!Array.isArray(metas) || metas.length === 0) {
            return [];
        }

        const listaTraduzida = [];

        for (const meta of metas) {

            if (!meta || typeof meta !== "object") {
                listaTraduzida.push(meta);
                continue;
            }

            const copia = { ...meta };

            const descricao = obterValor(
                copia,
                ["description", "targetDescription", "title", "name"],
                ""
            );

            if (descricao) {
                copia.description = await traduzirTexto(descricao, "pt");
            }

            listaTraduzida.push(copia);
        }

        return listaTraduzida;
    }


    function renderizarMetas(metas, codigoOds) {

        if (!metasApi) {
            return;
        }

        metasApi.innerHTML = "";

        if (metas.length === 0) {

            metasApi.innerHTML = `
                <div class="col-12">
                    <div class="api-empty">
                        <i class="fa-solid fa-circle-info me-2"></i>
                        Nenhuma meta encontrada para a pesquisa.
                    </div>
                </div>
            `;

            return;
        }

        metas.forEach(function (meta, indice) {

            const codigo = obterValor(
                meta,
                ["code", "targetCode", "target", "id"],
                `17.${indice + 1}`
            );

            const descricao = obterValor(
                meta,
                ["description", "targetDescription", "title", "name"],
                "Descrição da meta não disponível."
            );

            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4";

            col.innerHTML = `
                <article class="api-card">
                    <span class="api-code">
                        Meta ${codigo}
                    </span>

                    <h3>
                        <i class="fa-solid fa-handshake-angle me-2"></i>
                        ODS ${codigo}
                    </h3>

                    <p>
                        ${descricao}
                    </p>
                </article>
            `;

            metasApi.appendChild(col);
        });
    }


    async function carregarMetasAPI(codigoOds = 17) {

        if (!metasApi) {
            return;
        }

        const codigo = String(codigoOds).trim();

        atualizarStatus(
            '<i class="fa-solid fa-spinner fa-spin me-2"></i> Carregando dados da ONU...'
        );

        metasApi.innerHTML = `
            <div class="col-12 text-center py-4">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
            </div>
        `;

        try {

            const resposta = await fetch(API_URL + codigo + "/Target/list");

            if (!resposta.ok) {
                throw new Error(
                    "A API retornou o status HTTP " + resposta.status
                );
            }

            const dados = await resposta.json();

            const metasOriginais = extrairMetas(dados);
            metasCarregadas = await traduzirMetas(metasOriginais);

            renderizarMetas(metasCarregadas, codigo );

            atualizarStatus(
                `<i class="fa-solid fa-circle-check me-2"></i>
                 Dados carregados com sucesso da API oficial da ONU e traduzidos para o português.
                 <strong>${metasCarregadas.length}</strong> registros recebidos para a ODS ${codigo}.`,
                "sucesso"
            );

        } catch (erro) {

            console.error("Erro ao consultar a API:", erro);

            metasCarregadas = [];

            metasApi.innerHTML = `
                <div class="col-12">
                    <div class="api-empty">
                        <i class="fa-solid fa-triangle-exclamation me-2"></i>
                        Não foi possível carregar os dados externos no momento.
                        Verifique a conexão com a internet e tente novamente.
                    </div>
                </div>
            `;

            atualizarStatus(
                `<i class="fa-solid fa-circle-exclamation me-2"></i>
                 Erro ao consultar a API: ${erro.message}`,
                "erro"
            );
        }
    }


    /* =====================================================
       FILTRO DAS METAS - MANIPULAÇÃO DO DOM
       ===================================================== */

    if (buscaMeta) {

        buscaMeta.addEventListener("input", function () {

            const termo = this.value.trim();
            const codigo = extrairCodigoOds(termo);

            if (codigo) {
                carregarMetasAPI(codigo);
                return;
            }

            if (termo === "") {
                carregarMetasAPI();
                return;
            }

            const termoBusca = termo.toLowerCase();

            const filtradas = metasCarregadas.filter(function (meta) {

                const texto = JSON.stringify(meta).toLowerCase();

                return texto.includes(termoBusca);
            });

            renderizarMetas(filtradas);
        });
    }


    /* =====================================================
       BOTÃO ATUALIZAR - EVENTO DE CLIQUE
       ===================================================== */

    if (btnAtualizarMetas) {

        btnAtualizarMetas.addEventListener("click", function () {

            carregarMetasAPI();
        });
    }


    /* =====================================================
       ANO AUTOMÁTICO
       ===================================================== */

    const footerYear = document.getElementById("footerYear");

    if (footerYear) {

        const ano = new Date().getFullYear();

        footerYear.textContent =
            `© ${ano} - Projeto acadêmico de Desenvolvimento Web. ODS 17 - Parcerias para os Objetivos.`;
    }


    /* Carrega a API assim que a página é aberta. */
    carregarMetasAPI();

});
