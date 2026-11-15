import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTruck, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <h4>🏕️ Carpax</h4>
                    <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
                        Tu refugio para cada aventura.
                    </p>
                    <div className="socials">
                        <a href="#" aria-label="Facebook"><FaFacebook /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="YouTube"><FaYoutube /></a>
                    </div>
                </div>

                <div>
                    <h4>Ayuda</h4>
                    <a href="#">Envíos</a>
                    <a href="#">Cambios y devoluciones</a>
                    <a href="#">Preguntas frecuentes</a>
                    <a href="#">Términos y condiciones</a>
                </div>

                <div>
                    <h4>Contacto</h4>
                    <a href="#">📞 +57 300 123 4567</a>
                    <a href="#">✉️ info@carpax.co</a>
                    <a href="#">📍 Bogotá, Colombia</a>
                </div>

                <div>
                    <h4>Beneficios</h4>
                    <a href="#"><FaTruck /> Envío gratis</a>
                    <a href="#"><FaHandshake /> Pago contraentrega</a>
                    <a href="#"><FaShieldAlt /> Garantía de entrega</a>
                </div>
            </div>

            <div className="bottom">
                &copy; {new Date().getFullYear()} Carpax. Todos los derechos reservados.
            </div>
        </footer>
    );
}

export default Footer;