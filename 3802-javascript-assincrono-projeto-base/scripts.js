// Obtém referências aos elementos do DOM
const uploadBtn = document.getElementById("upload-btn");
const inputUpload = document.getElementById("image-upload");

// Adiciona um evento de clique ao botão para simular um clique no input file
uploadBtn.addEventListener("click", () => {
    inputUpload.click();
});

// Função para ler o conteúdo do arquivo selecionado
function lerConteudoDoArquivo(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        
        // Quando a leitura for concluída, resolve a Promise com a URL do arquivo
        leitor.onload = () => {
            resolve({ url: leitor.result, nome: arquivo.name });
        };

        // Caso ocorra um erro na leitura do arquivo, rejeita a Promise
        leitor.onerror = () => {
            reject(`Erro na leitura do arquivo ${arquivo.name}`);
        };

        // Lê o arquivo como uma URL de dados base64
        leitor.readAsDataURL(arquivo);
    });
}

// Obtém referências para a exibição da imagem e seu nome
const imagemPrincipal = document.querySelector(".main-imagem");
const nomeDaImagem = document.querySelector(".container-imagem-nome p");

// Adiciona evento para capturar a mudança no input de upload
inputUpload.addEventListener("change", async (evento) => {
    const arquivo = evento.target.files[0];

    if (arquivo) {
        try {
            // Lê o conteúdo do arquivo e exibe na página
            const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo);
            imagemPrincipal.src = conteudoDoArquivo.url;
            nomeDaImagem.textContent = conteudoDoArquivo.nome;
        } catch (erro) {
            console.error("Erro na leitura do arquivo");
        }
    }
});

// Obtém referências para o campo de entrada de tags e a lista de tags
const inputTags = document.getElementById("input-tags");
const listaTags = document.getElementById("lista-tags");

// Adiciona evento de clique para remover tags da lista
listaTags.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("remove-tag")) {
        const tagQueQueremosRemover = evento.target.parentElement;
        listaTags.removeChild(tagQueQueremosRemover);
    }
});

// Lista de tags disponíveis
const tagsDisponiveis = [
    "front-end", "programação", "data science", "full-stack", "html", "css", "javascript",
    "python", "java", "c++", "c#", "php", "ruby", "swift", "kotlin", "go", "rust", "dart",
    "typescript", "react", "angular", "vue.js"
];

// Simula a verificação de disponibilidade de uma tag
async function verificaTagsDisponiveis(tagTexto) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(tagsDisponiveis.includes(tagTexto));
        }, 1000);
    });
}

// Adiciona evento para capturar a tecla "Enter" no input de tags
inputTags.addEventListener("keypress", async (evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        const tagTexto = inputTags.value.trim().toLowerCase();
        
        if (tagTexto !== "") {
            // Verifica se a tag já foi adicionada
            if ([...listaTags.children].some(tag => tag.textContent.trim() === tagTexto)) {
                alert("Esta tag já foi adicionada.");
                return;
            }
            // Limita o número máximo de tags a 5
            else if (listaTags.children.length >= 5) {
                alert("Você só pode selecionar no máximo 5 tags.");
                return;
            }
            try {
                // Verifica se a tag digitada está na lista de disponíveis
                const tagExiste = await verificaTagsDisponiveis(tagTexto);
                if (tagExiste) {
                    // Cria um novo elemento de tag e adiciona à lista
                    const tagNova = document.createElement("li");
                    tagNova.innerHTML = `<p>${tagTexto}</p> <img src="./img/close-black.svg" class="remove-tag">`;
                    listaTags.appendChild(tagNova);
                    inputTags.value = "";
                } else {
                    alert("Tag não foi encontrada.");
                    console.warn(`Tag não encontrada: ${tagTexto}`);
                }
            } catch (error) {
                console.error("Erro ao verificar a existência da tag");
                alert("Erro ao verificar a existência da tag. Verifique o console.");
            }
        }
    }
});

async function publicarProjeto(nome, descricao, tags) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Projeto enviado:", { nome, descricao, tags });
            resolve({ sucesso: true, mensagem: "Projeto publicado com sucesso!" });
        }, 2000); // Simulando um tempo de resposta do servidor
    });
}


// Obtém referência ao botão de publicar
const botaoPublicar = document.querySelector(".botao-publicar");

// Adiciona evento de clique ao botão de publicar
botaoPublicar.addEventListener("click", async (evento) => {
    evento.preventDefault();

    // Obtém valores do nome do projeto, descrição e tags selecionadas
    const nomeDoProjeto = document.getElementById("nome").value;
    const descricaoDoProjeto = document.getElementById("descricao").value;
    const tagsProjeto = Array.from(listaTags.querySelectorAll("p")).map((tag) => tag.textContent);
    
    // Validação básica antes de tentar publicar
    if (!nomeDoProjeto || !descricaoDoProjeto || tagsProjeto.length === 0) {
        return alert("Preencha todos os campos antes de publicar.");
    }

    try {
        botaoPublicar.disabled = true; // Evita múltiplos cliques
        botaoPublicar.textContent = "Publicando...";

        // Simula a publicação do projeto
        const resultado = await publicarProjeto(nomeDoProjeto, descricaoDoProjeto, tagsProjeto);
        
        console.log("Projeto publicado com sucesso!", resultado);
        alert("Projeto publicado com sucesso!");
    } catch (error) {
        console.error("Erro ao publicar o projeto:", error);
        alert(`Erro ao publicar o projeto: ${error.message || "Verifique o console para mais detalhes."}`);
    }
});

