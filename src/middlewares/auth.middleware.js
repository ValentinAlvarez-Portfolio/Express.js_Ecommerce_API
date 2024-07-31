
import {
    verifyJWT
} from "../utils/JWT/jwt.utils.js";
import UnauthorizedException from "../common/exceptions/factory/unauthorized-exception.js";
import ForbiddenException from "../common/exceptions/factory/forbidden-exception.js";


// Clase Middleware para el manejo de la autenticación 
export class AuthMiddleware {

    constructor(req, res, next, authRole = ['user', 'premium', 'admin']) {

        this.req = req;
        this.res = res;
        this.next = next;
        this.authRole = authRole ? authRole : ['user', 'premium', 'admin'];

    }

    async verifySession() {

        const headers = this.req.headers;
        const cookies = this.req.cookies;

        const auth = headers.authorization || cookies.auth;

        if (!auth) {

            throw new UnauthorizedException('Invalid session', AuthMiddleware.name);

        }

        const token = auth.includes('Bearer') ? auth.split(' ')[1] : auth;

        const decoded = this.verifyAndDecodeToken(token);

        if (!decoded.payload) {
            
            throw new UnauthorizedException('Invalid session', AuthMiddleware.name);

        }

        this.verifyRole(decoded.payload)

    }

    verifyAndDecodeToken(token) {

        const decoded = verifyJWT(token);

        if (!decoded) {
            throw new UnauthorizedException('Invalid session', AuthMiddleware.name);
        }

        return decoded;

    }

    verifyRole(userData) {

        if (!this.authRole.includes(userData.role.toLowerCase())) {

            throw new ForbiddenException('You do not have permission to access this resource', AuthMiddleware.name);

        }

        this.asignUserToRequest(userData);

    }

    asignUserToRequest(userData) {

        this.req.user = userData;

        this.next();

    }

}

export const authUser = (req, res, next) => {

    const authMiddleware = new AuthMiddleware(req, res, next, ['user', 'premium', 'admin'])

    authMiddleware.verifySession().catch(next);

};

export const authPremium = (req, res, next) => {

    const authMiddleware = new AuthMiddleware(req, res, next, ['premium', 'admin'])

    authMiddleware.verifySession().catch(next);

};

export const authAdmin = (req, res, next) => {

    const authMiddleware = new AuthMiddleware(req, res, next, ['admin'])

    authMiddleware.verifySession().catch(next);

};

export const authRedirect = (req, res, next) => {

    const headers = req.headers;
    const cookies = req.cookies;

    const auth = headers.authorization || cookies.auth;

    if (!auth) {

        return res.redirect('/login');

    }

    const token = auth.includes('Bearer') ? auth.split(' ')[1] : auth;

    const decoded = verifyJWT(token)

    if (!decoded.payload) {
            
        return res.redirect('/login')
    }

    req.user = decoded.payload
    
    next();

}
