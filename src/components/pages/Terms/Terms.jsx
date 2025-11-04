import React, { useEffect } from 'react';
import { ArrowLeft, FileText } from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Button from '../../atoms/Button';
import './Terms.css';

const Terms = () => {
  const { actions } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoBack = () => {
    actions.setCurrentPage('auth');
  };

  return (
    <DashboardTemplate>
      <div className="terms-page">
        <div className="terms-page__container">
          <div className="terms-page__header">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            Voltar
          </Button>
          
          <div className="terms-page__title-section">
            <FileText size={48} weight="duotone" />
            <h1>Termos de Uso e Política de Privacidade</h1>
            <p>Última atualização: 22 de outubro de 2025</p>
          </div>
        </div>

        <div className="terms-page__content">
          <section>
            <h2>1. Introdução</h2>
            <p>
              Bem-vindo à <strong>Swaply</strong> ("nós", "nosso" ou "plataforma"). Estes Termos de Uso ("Termos") 
              regem o acesso e uso dos nossos serviços de ensino e aprendizagem baseados em troca de conhecimento 
              através de um sistema de créditos.
            </p>
            <p>
              Ao criar uma conta, acessar ou usar a Swaply, você concorda em cumprir e ficar vinculado a estes Termos 
              e à nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não utilize 
              nossos serviços.
            </p>
          </section>

          <section>
            <h2>2. Definições</h2>
            <ul>
              <li><strong>Plataforma:</strong> Refere-se ao website e aplicativos da Swaply</li>
              <li><strong>Usuário:</strong> Qualquer pessoa que acessa ou utiliza a Plataforma</li>
              <li><strong>Estudante:</strong> Usuário que se matricula em cursos</li>
              <li><strong>Instrutor:</strong> Usuário que cria e ministra cursos</li>
              <li><strong>Crédito:</strong> Moeda virtual utilizada na Plataforma (1 crédito = 1 hora de curso)</li>
              <li><strong>Curso:</strong> Conteúdo educacional oferecido por Instrutores</li>
              <li><strong>Conta:</strong> Registro pessoal do Usuário na Plataforma</li>
            </ul>
          </section>

          <section>
            <h2>3. Aceitação dos Termos</h2>
            <p>Ao utilizar a Swaply, você declara que:</p>
            <ul>
              <li>Tem pelo menos 18 anos de idade ou possui consentimento de seu responsável legal</li>
              <li>Possui capacidade legal para celebrar contratos vinculativos</li>
              <li>Fornecerá informações verdadeiras, precisas e completas</li>
              <li>Manterá suas informações atualizadas</li>
              <li>Não utilizará a Plataforma para fins ilícitos ou não autorizados</li>
            </ul>
          </section>

          <section>
            <h2>4. Criação e Segurança da Conta</h2>
            <p>
              <strong>4.1. Registro:</strong> Para acessar determinadas funcionalidades, você deve criar uma conta 
              fornecendo um endereço de e-mail válido, senha segura e outras informações solicitadas.
            </p>
            <p>
              <strong>4.2. Segurança:</strong> Você é responsável por manter a confidencialidade de suas credenciais 
              de acesso e por todas as atividades que ocorram em sua conta. Notifique-nos imediatamente sobre qualquer 
              uso não autorizado.
            </p>
            <p>
              <strong>4.3. Veracidade:</strong> Você concorda em fornecer informações verdadeiras e precisas. 
              Informações falsas podem resultar na suspensão ou encerramento de sua conta.
            </p>
          </section>

          <section>
            <h2>5. Sistema de Créditos</h2>
            <p>
              <strong>5.1. Funcionamento:</strong> A Swaply utiliza um sistema de créditos virtuais onde 1 crédito 
              equivale a 1 hora de curso. Créditos não têm valor monetário e não podem ser trocados por dinheiro.
            </p>
            <p>
              <strong>5.2. Obtenção:</strong> Créditos podem ser obtidos através de:
            </p>
            <ul>
              <li>Bônus de boas-vindas ao criar sua conta (10 créditos iniciais)</li>
              <li>Ensinar cursos na plataforma (1 crédito por hora ensinada)</li>
              <li>Completar cursos e receber avaliações positivas</li>
              <li>Participar de programas de incentivo da plataforma</li>
            </ul>
            <p>
              <strong>5.3. Uso:</strong> Créditos são utilizados para matricular-se em cursos e agendar aulas individuais.
            </p>
            <p>
              <strong>5.4. Validade:</strong> Créditos não expiram enquanto sua conta estiver ativa.
            </p>
            <p>
              <strong>5.5. Não Transferibilidade:</strong> Créditos não podem ser transferidos entre contas ou 
              convertidos em dinheiro.
            </p>
          </section>

          <section>
            <h2>6. Proteção de Dados e LGPD</h2>
            <h3>6.1. Coleta de Dados</h3>
            <p>Coletamos as seguintes informações pessoais:</p>
            <ul>
              <li><strong>Dados de identificação:</strong> nome, e-mail, foto de perfil</li>
              <li><strong>Dados de navegação:</strong> endereço IP, cookies, logs de acesso</li>
              <li><strong>Dados de uso:</strong> cursos acessados, interações, avaliações</li>
              <li><strong>Dados opcionais:</strong> biografia, habilidades, redes sociais</li>
            </ul>

            <h3>6.2. Seus Direitos (LGPD - Art. 18)</h3>
            <p>Você tem os seguintes direitos sobre seus dados pessoais:</p>
            <ul>
              <li><strong>Acesso:</strong> Confirmar se tratamos seus dados e acessá-los</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Exclusão:</strong> Solicitar eliminação de dados tratados com seu consentimento</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato através do e-mail: 
              <strong> privacidade@swaply.com</strong>
            </p>
          </section>
        </div>

        <div className="terms-page__footer">
          <p>
            <strong>Swaply Educação LTDA</strong><br />
            CNPJ: XX.XXX.XXX/XXXX-XX<br />
            Versão 1.0 - Última atualização: 22 de outubro de 2025
          </p>
        </div>
      </div>
    </div>
    </DashboardTemplate>
  );
};

export default Terms;
