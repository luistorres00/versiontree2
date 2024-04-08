const jwt = require("jsonwebtoken");
const { secret } = require("../utilities/jwtUtils");
const { User } = require("../models/models");

function authenticateToken(req, res, next) {
  // Obtenha o token JWT da requisição (geralmente vem no cabeçalho 'Authorization')
  const token = req.headers["authorization"];

  // Se o token não estiver presente ou estiver em um formato inválido, retorne um erro de autorização
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extrai apenas o token (remove 'Bearer ')
  const authToken = token.split(" ")[1];

  // Verifica se o token é válido
  jwt.verify(authToken, secret, async (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Se o token for válido, você pode acessar as informações do usuário a partir do 'decoded.data'
    const username = decoded.data.username;

    // Verifica se o usuário correspondente ao token ainda existe no banco de dados
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      // Armazena as informações do usuário na requisição para uso posterior
      req.user = user;
      next(); // Permite que a solicitação continue para a próxima função de middleware ou rota
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}

module.exports = authenticateToken;
