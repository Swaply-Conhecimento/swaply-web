import React, { useEffect } from 'react';
import { ArrowLeft, FileText, Shield, UserCheck, Eye, Lock } from '@phosphor-icons/react';
import { useApp } from '../../../contexts';
import DashboardTemplate from '../../templates/DashboardTemplate';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import './Terms.css';

const Terms = () => {
  const { actions } = useApp();

  useEffect(() => {
    // Scroll para o topo ao carregar
    window.scrollTo(0, 0);
  }, []);

  const handleGoBack = () => {
    actions.setCurrentPage('auth');
  };

  return (
    <DashboardTemplate>
      <div className="terms">
        {/* Header */}
        <div className="terms__header">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            Voltar
          </Button>
          
          <div className="terms__header-content">
            <FileText size={48} weight="duotone" className="terms__header-icon" />
            <h1 className="terms__title">Termos de Uso e Política de Privacidade</h1>
            <p className="terms__subtitle">
              Última atualização: 22 de outubro de 2025
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="terms__highlights">
          <Card className="terms__highlight-card">
            <Shield size={24} weight="duotone" />
            <span>Seus dados protegidos pela LGPD</span>
          </Card>
          <Card className="terms__highlight-card">
            <UserCheck size={24} weight="duotone" />
            <span>Você controla suas informações</span>
          </Card>
          <Card className="terms__highlight-card">
            <Eye size={24} weight="duotone" />
            <span>Total transparência</span>
          </Card>
          <Card className="terms__highlight-card">
            <Lock size={24} weight="duotone" />
            <span>Segurança em primeiro lugar</span>
          </Card>
        </div>

        {/* Content */}
        <Card className="terms__content" padding="large">
          {/* Introdução */}
          <section className="terms__section">
            <h2 className="terms__section-title">1. Introdução</h2>
            <p className="terms__text">
              Bem-vindo à <strong>Swaply</strong> ("nós", "nosso" ou "plataforma"). Estes Termos de Uso ("Termos") 
              regem o acesso e uso dos nossos serviços de ensino e aprendizagem baseados em troca de conhecimento 
              através de um sistema de créditos.
            </p>
            <p className="terms__text">
              Ao criar uma conta, acessar ou usar a Swaply, você concorda em cumprir e ficar vinculado a estes Termos 
              e à nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não utilize 
              nossos serviços.
            </p>
          </section>

          {/* Definições */}
          <section className="terms__section">
            <h2 className="terms__section-title">2. Definições</h2>
            <ul className="terms__list">
              <li><strong>Plataforma:</strong> Refere-se ao website e aplicativos da Swaply</li>
              <li><strong>Usuário:</strong> Qualquer pessoa que acessa ou utiliza a Plataforma</li>
              <li><strong>Estudante:</strong> Usuário que se matricula em cursos</li>
              <li><strong>Instrutor:</strong> Usuário que cria e ministra cursos</li>
              <li><strong>Crédito:</strong> Moeda virtual utilizada na Plataforma (1 crédito = 1 hora de curso)</li>
              <li><strong>Curso:</strong> Conteúdo educacional oferecido por Instrutores</li>
              <li><strong>Conta:</strong> Registro pessoal do Usuário na Plataforma</li>
            </ul>
          </section>

          {/* Aceitação dos Termos */}
          <section className="terms__section">
            <h2 className="terms__section-title">3. Aceitação dos Termos</h2>
            <p className="terms__text">
              Ao utilizar a Swaply, você declara que:
            </p>
            <ul className="terms__list">
              <li>Tem pelo menos 18 anos de idade ou possui consentimento de seu responsável legal</li>
              <li>Possui capacidade legal para celebrar contratos vinculativos</li>
              <li>Fornecerá informações verdadeiras, precisas e completas</li>
              <li>Manterá suas informações atualizadas</li>
              <li>Não utilizará a Plataforma para fins ilícitos ou não autorizados</li>
            </ul>
          </section>

          {/* Criação de Conta */}
          <section className="terms__section">
            <h2 className="terms__section-title">4. Criação e Segurança da Conta</h2>
            <p className="terms__text">
              <strong>4.1. Registro:</strong> Para acessar determinadas funcionalidades, você deve criar uma conta 
              fornecendo um endereço de e-mail válido, senha segura e outras informações solicitadas.
            </p>
            <p className="terms__text">
              <strong>4.2. Segurança:</strong> Você é responsável por manter a confidencialidade de suas credenciais 
              de acesso e por todas as atividades que ocorram em sua conta. Notifique-nos imediatamente sobre qualquer 
              uso não autorizado.
            </p>
            <p className="terms__text">
              <strong>4.3. Veracidade:</strong> Você concorda em fornecer informações verdadeiras e precisas. 
              Informações falsas podem resultar na suspensão ou encerramento de sua conta.
            </p>
          </section>

          {/* Sistema de Créditos */}
          <section className="terms__section">
            <h2 className="terms__section-title">5. Sistema de Créditos</h2>
            <p className="terms__text">
              <strong>5.1. Funcionamento:</strong> A Swaply utiliza um sistema de créditos virtuais onde 1 crédito 
              equivale a 1 hora de curso. Créditos não têm valor monetário e não podem ser trocados por dinheiro.
            </p>
            <p className="terms__text">
              <strong>5.2. Obtenção:</strong> Créditos podem ser obtidos através de:
            </p>
            <ul className="terms__list">
              <li>Bônus de boas-vindas ao criar sua conta (10 créditos iniciais)</li>
              <li>Ensinar cursos na plataforma (1 crédito por hora ensinada)</li>
              <li>Completar cursos e receber avaliações positivas</li>
              <li>Participar de programas de incentivo da plataforma</li>
            </ul>
            <p className="terms__text">
              <strong>5.3. Uso:</strong> Créditos são utilizados para matricular-se em cursos e agendar aulas individuais.
            </p>
            <p className="terms__text">
              <strong>5.4. Validade:</strong> Créditos não expiram enquanto sua conta estiver ativa.
            </p>
            <p className="terms__text">
              <strong>5.5. Não Transferibilidade:</strong> Créditos não podem ser transferidos entre contas ou 
              convertidos em dinheiro.
            </p>
          </section>

          {/* Cursos e Conteúdo */}
          <section className="terms__section">
            <h2 className="terms__section-title">6. Cursos e Conteúdo Educacional</h2>
            <p className="terms__text">
              <strong>6.1. Criação de Cursos:</strong> Instrutores podem criar cursos mediante aprovação e devem:
            </p>
            <ul className="terms__list">
              <li>Possuir conhecimento adequado sobre o tema</li>
              <li>Criar conteúdo original ou ter direitos de uso</li>
              <li>Não incluir conteúdo ilegal, ofensivo ou discriminatório</li>
              <li>Manter padrões de qualidade adequados</li>
            </ul>
            <p className="terms__text">
              <strong>6.2. Propriedade Intelectual:</strong> Instrutores mantêm os direitos sobre seu conteúdo, mas 
              concedem à Swaply uma licença não exclusiva para hospedar, distribuir e promover seus cursos.
            </p>
            <p className="terms__text">
              <strong>6.3. Matrículas:</strong> Estudantes podem se matricular em cursos mediante disponibilidade 
              de créditos e vagas. Matrículas são confirmadas instantaneamente.
            </p>
          </section>

          {/* Política de Privacidade e LGPD */}
          <section className="terms__section terms__section--highlight">
            <h2 className="terms__section-title">
              <Shield size={28} weight="duotone" />
              7. Proteção de Dados e LGPD
            </h2>
            
            <h3 className="terms__subsection-title">7.1. Coleta de Dados</h3>
            <p className="terms__text">
              Coletamos as seguintes informações pessoais:
            </p>
            <ul className="terms__list">
              <li><strong>Dados de identificação:</strong> nome, e-mail, foto de perfil</li>
              <li><strong>Dados de navegação:</strong> endereço IP, cookies, logs de acesso</li>
              <li><strong>Dados de uso:</strong> cursos acessados, interações, avaliações</li>
              <li><strong>Dados opcionais:</strong> biografia, habilidades, redes sociais</li>
            </ul>

            <h3 className="terms__subsection-title">7.2. Finalidade do Tratamento</h3>
            <p className="terms__text">
              Utilizamos seus dados pessoais para:
            </p>
            <ul className="terms__list">
              <li>Criar e gerenciar sua conta</li>
              <li>Fornecer acesso aos cursos e serviços</li>
              <li>Processar matrículas e gerenciar créditos</li>
              <li>Comunicar informações sobre cursos e atualizações</li>
              <li>Melhorar a experiência na plataforma</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Prevenir fraudes e garantir segurança</li>
            </ul>

            <h3 className="terms__subsection-title">7.3. Base Legal (LGPD)</h3>
            <p className="terms__text">
              O tratamento de seus dados pessoais está fundamentado em:
            </p>
            <ul className="terms__list">
              <li><strong>Consentimento:</strong> Você fornece consentimento expresso ao criar sua conta</li>
              <li><strong>Execução de contrato:</strong> Necessário para fornecer os serviços contratados</li>
              <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e prevenir fraudes</li>
              <li><strong>Cumprimento legal:</strong> Para atender obrigações legais e regulatórias</li>
            </ul>

            <h3 className="terms__subsection-title">7.4. Compartilhamento de Dados</h3>
            <p className="terms__text">
              Seus dados pessoais podem ser compartilhados com:
            </p>
            <ul className="terms__list">
              <li><strong>Instrutores:</strong> Nome e foto de perfil visíveis em suas matrículas</li>
              <li><strong>Outros estudantes:</strong> Nome e foto em avaliações (se não anônimas)</li>
              <li><strong>Prestadores de serviços:</strong> Serviços de email, hospedagem, analytics (sob contrato)</li>
              <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
            </ul>
            <p className="terms__text">
              <strong>Importante:</strong> Nunca compartilhamos seus dados com terceiros para fins de marketing 
              sem seu consentimento explícito.
            </p>

            <h3 className="terms__subsection-title">7.5. Seus Direitos (LGPD - Art. 18)</h3>
            <p className="terms__text">
              Você tem os seguintes direitos sobre seus dados pessoais:
            </p>
            <ul className="terms__list">
              <li><strong>Acesso:</strong> Confirmar se tratamos seus dados e acessá-los</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização:</strong> Solicitar anonimização de dados desnecessários</li>
              <li><strong>Exclusão:</strong> Solicitar eliminação de dados tratados com seu consentimento</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se a tratamento realizado sem consentimento</li>
              <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
            </ul>
            <p className="terms__text">
              Para exercer seus direitos, entre em contato através do e-mail: 
              <strong> privacidade@swaply.com</strong>
            </p>

            <h3 className="terms__subsection-title">7.6. Armazenamento e Segurança</h3>
            <p className="terms__text">
              Adotamos medidas técnicas e organizacionais para proteger seus dados:
            </p>
            <ul className="terms__list">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Criptografia de dados sensíveis em repouso</li>
              <li>Controles de acesso baseados em função</li>
              <li>Monitoramento de segurança 24/7</li>
              <li>Backups regulares e seguros</li>
              <li>Testes de segurança periódicos</li>
            </ul>

            <h3 className="terms__subsection-title">7.7. Retenção de Dados</h3>
            <p className="terms__text">
              Mantemos seus dados pessoais enquanto sua conta estiver ativa ou conforme necessário para:
            </p>
            <ul className="terms__list">
              <li>Fornecer nossos serviços</li>
              <li>Cumprir obrigações legais (até 5 anos após o término da relação)</li>
              <li>Resolver disputas e fazer cumprir nossos acordos</li>
            </ul>
            <p className="terms__text">
              Após a exclusão da conta, anonimizamos ou excluímos seus dados pessoais, exceto quando 
              legalmente obrigados a mantê-los.
            </p>

            <h3 className="terms__subsection-title">7.8. Cookies e Tecnologias Similares</h3>
            <p className="terms__text">
              Utilizamos cookies e tecnologias similares para:
            </p>
            <ul className="terms__list">
              <li>Manter você conectado (cookies essenciais)</li>
              <li>Lembrar suas preferências (tema, fonte)</li>
              <li>Analisar como você usa a plataforma (analytics)</li>
              <li>Melhorar a experiência do usuário</li>
            </ul>
            <p className="terms__text">
              Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
            </p>
          </section>

          {/* Responsabilidades */}
          <section className="terms__section">
            <h2 className="terms__section-title">8. Responsabilidades do Usuário</h2>
            <p className="terms__text">
              Como usuário da Swaply, você se compromete a:
            </p>
            <ul className="terms__list">
              <li>Não utilizar a plataforma para atividades ilegais</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
              <li>Não compartilhar conteúdo ofensivo, discriminatório ou impróprio</li>
              <li>Não tentar burlar o sistema de créditos</li>
              <li>Não criar múltiplas contas para obter vantagens indevidas</li>
              <li>Não fazer spam ou enviar comunicações não solicitadas</li>
              <li>Respeitar outros usuários e instrutores</li>
              <li>Não reproduzir ou distribuir conteúdo dos cursos sem autorização</li>
            </ul>
          </section>

          {/* Conduta de Instrutores */}
          <section className="terms__section">
            <h2 className="terms__section-title">9. Conduta de Instrutores</h2>
            <p className="terms__text">
              Instrutores devem:
            </p>
            <ul className="terms__list">
              <li>Fornecer conteúdo educacional de qualidade</li>
              <li>Respeitar horários agendados com estudantes</li>
              <li>Responder dúvidas e fornecer suporte adequado</li>
              <li>Manter conduta profissional e respeitosa</li>
              <li>Não plagiar ou usar conteúdo de terceiros sem autorização</li>
              <li>Cumprir com o cronograma e currículo anunciados</li>
            </ul>
          </section>

          {/* Cancelamentos e Reembolsos */}
          <section className="terms__section">
            <h2 className="terms__section-title">10. Cancelamentos e Reembolsos</h2>
            <p className="terms__text">
              <strong>10.1. Cancelamento de Aulas Agendadas:</strong>
            </p>
            <ul className="terms__list">
              <li>Cancelamento com 24h+ de antecedência: reembolso total de créditos</li>
              <li>Cancelamento entre 12-24h: reembolso de 50% dos créditos</li>
              <li>Cancelamento com menos de 12h: sem reembolso</li>
              <li>Cancelamento pelo instrutor: sempre reembolso total</li>
            </ul>
            <p className="terms__text">
              <strong>10.2. Cancelamento de Matrículas:</strong> Estudantes podem cancelar matrículas em cursos 
              sem aulas agendadas a qualquer momento com reembolso total dos créditos.
            </p>
          </section>

          {/* Propriedade Intelectual */}
          <section className="terms__section">
            <h2 className="terms__section-title">11. Propriedade Intelectual</h2>
            <p className="terms__text">
              <strong>11.1. Conteúdo da Plataforma:</strong> Todo conteúdo da Swaply (design, código, marca, logo) 
              é de propriedade exclusiva da plataforma e protegido por leis de propriedade intelectual.
            </p>
            <p className="terms__text">
              <strong>11.2. Conteúdo dos Cursos:</strong> Instrutores mantêm propriedade de seu conteúdo, mas 
              concedem à Swaply licença para:
            </p>
            <ul className="terms__list">
              <li>Hospedar e armazenar o conteúdo</li>
              <li>Distribuir aos estudantes matriculados</li>
              <li>Promover os cursos na plataforma e em marketing</li>
              <li>Fazer cópias de backup</li>
            </ul>
            <p className="terms__text">
              <strong>11.3. Conteúdo do Usuário:</strong> Ao postar avaliações, comentários ou outro conteúdo, 
              você concede à Swaply direito de usá-lo para melhorar a plataforma.
            </p>
          </section>

          {/* Proibições */}
          <section className="terms__section">
            <h2 className="terms__section-title">12. Condutas Proibidas</h2>
            <p className="terms__text">
              É estritamente proibido:
            </p>
            <ul className="terms__list">
              <li>Violar direitos de propriedade intelectual</li>
              <li>Publicar conteúdo falso, enganoso ou difamatório</li>
              <li>Assediar, ameaçar ou intimidar outros usuários</li>
              <li>Tentar acessar contas de terceiros</li>
              <li>Interferir no funcionamento da plataforma</li>
              <li>Usar bots, scrapers ou ferramentas automatizadas</li>
              <li>Revender acesso à plataforma</li>
              <li>Compartilhar credenciais de acesso</li>
            </ul>
          </section>

          {/* Suspensão e Encerramento */}
          <section className="terms__section">
            <h2 className="terms__section-title">13. Suspensão e Encerramento</h2>
            <p className="terms__text">
              <strong>13.1. Suspensão:</strong> Podemos suspender sua conta temporariamente por violação destes Termos, 
              pendências investigativas ou suspeita de fraude.
            </p>
            <p className="terms__text">
              <strong>13.2. Encerramento:</strong> Podemos encerrar sua conta permanentemente por:
            </p>
            <ul className="terms__list">
              <li>Violação grave ou repetida destes Termos</li>
              <li>Atividade fraudulenta ou ilegal</li>
              <li>Conduta que prejudique outros usuários ou a plataforma</li>
            </ul>
            <p className="terms__text">
              <strong>13.3. Encerramento Voluntário:</strong> Você pode excluir sua conta a qualquer momento através 
              das configurações. Seus créditos não utilizados serão perdidos.
            </p>
          </section>

          {/* Limitação de Responsabilidade */}
          <section className="terms__section">
            <h2 className="terms__section-title">14. Limitação de Responsabilidade</h2>
            <p className="terms__text">
              <strong>14.1. Disponibilidade:</strong> A Swaply é fornecida "no estado em que se encontra". 
              Não garantimos que o serviço será ininterrupto, livre de erros ou completamente seguro.
            </p>
            <p className="terms__text">
              <strong>14.2. Conteúdo de Terceiros:</strong> Não somos responsáveis pelo conteúdo criado por 
              instrutores. Instrutores são os únicos responsáveis pela qualidade e legalidade de seus cursos.
            </p>
            <p className="terms__text">
              <strong>14.3. Resultados:</strong> Não garantimos resultados específicos de aprendizagem. 
              O sucesso educacional depende do esforço individual.
            </p>
            <p className="terms__text">
              <strong>14.4. Links Externos:</strong> Não somos responsáveis por conteúdo de sites externos 
              que possam ser linkados.
            </p>
          </section>

          {/* Indenização */}
          <section className="terms__section">
            <h2 className="terms__section-title">15. Indenização</h2>
            <p className="terms__text">
              Você concorda em indenizar e isentar a Swaply, seus diretores, funcionários e parceiros de 
              quaisquer reivindicações, danos ou despesas decorrentes de:
            </p>
            <ul className="terms__list">
              <li>Violação destes Termos</li>
              <li>Violação de direitos de terceiros</li>
              <li>Uso inadequado da plataforma</li>
              <li>Conteúdo que você publicar</li>
            </ul>
          </section>

          {/* Modificações */}
          <section className="terms__section">
            <h2 className="terms__section-title">16. Modificações dos Termos</h2>
            <p className="terms__text">
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos sobre 
              mudanças significativas através de:
            </p>
            <ul className="terms__list">
              <li>E-mail para o endereço cadastrado</li>
              <li>Aviso destacado na plataforma</li>
              <li>Notificação in-app</li>
            </ul>
            <p className="terms__text">
              O uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* Lei Aplicável */}
          <section className="terms__section">
            <h2 className="terms__section-title">17. Lei Aplicável e Foro</h2>
            <p className="terms__text">
              Estes Termos são regidos pelas leis da República Federativa do Brasil, especialmente:
            </p>
            <ul className="terms__list">
              <li><strong>Lei Geral de Proteção de Dados (LGPD)</strong> - Lei nº 13.709/2018</li>
              <li><strong>Marco Civil da Internet</strong> - Lei nº 12.965/2014</li>
              <li><strong>Código de Defesa do Consumidor</strong> - Lei nº 8.078/1990</li>
              <li><strong>Código Civil Brasileiro</strong> - Lei nº 10.406/2002</li>
            </ul>
            <p className="terms__text">
              Fica eleito o foro da comarca de [CIDADE], Estado de [ESTADO], para dirimir quaisquer 
              controvérsias decorrentes destes Termos.
            </p>
          </section>

          {/* Encarregado de Dados */}
          <section className="terms__section terms__section--highlight">
            <h2 className="terms__section-title">
              <UserCheck size={28} weight="duotone" />
              18. Encarregado de Proteção de Dados (DPO)
            </h2>
            <p className="terms__text">
              Em conformidade com a LGPD, designamos um Encarregado de Proteção de Dados para atuar como 
              canal de comunicação entre você, a Swaply e a Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
            <div className="terms__contact-box">
              <p><strong>Encarregado de Dados (DPO)</strong></p>
              <p>E-mail: <a href="mailto:dpo@swaply.com">dpo@swaply.com</a></p>
              <p>Endereço: [Endereço completo da empresa]</p>
              <p>Horário de atendimento: Segunda a Sexta, 9h às 18h</p>
            </div>
          </section>

          {/* Disposições Gerais */}
          <section className="terms__section">
            <h2 className="terms__section-title">19. Disposições Gerais</h2>
            <p className="terms__text">
              <strong>19.1. Integralidade:</strong> Estes Termos constituem o acordo integral entre você e a Swaply.
            </p>
            <p className="terms__text">
              <strong>19.2. Independência:</strong> Se qualquer disposição for considerada inválida, as demais 
              permanecerão em vigor.
            </p>
            <p className="terms__text">
              <strong>19.3. Renúncia:</strong> A falha em exercer qualquer direito não constitui renúncia.
            </p>
            <p className="terms__text">
              <strong>19.4. Cessão:</strong> Você não pode transferir seus direitos ou obrigações sem 
              nosso consentimento prévio por escrito.
            </p>
          </section>

          {/* Contato */}
          <section className="terms__section terms__section--contact">
            <h2 className="terms__section-title">20. Contato</h2>
            <p className="terms__text">
              Para questões sobre estes Termos ou sobre a plataforma:
            </p>
            <div className="terms__contact-grid">
              <div className="terms__contact-item">
                <h4>Suporte Geral</h4>
                <p>suporte@swaply.com</p>
              </div>
              <div className="terms__contact-item">
                <h4>Privacidade e Dados</h4>
                <p>privacidade@swaply.com</p>
              </div>
              <div className="terms__contact-item">
                <h4>Encarregado (DPO)</h4>
                <p>dpo@swaply.com</p>
              </div>
              <div className="terms__contact-item">
                <h4>Ouvidoria</h4>
                <p>ouvidoria@swaply.com</p>
              </div>
            </div>
          </section>

          {/* Aceitação */}
          <section className="terms__section terms__section--acceptance">
            <div className="terms__acceptance-box">
              <h3>Aceitação dos Termos</h3>
              <p>
                Ao clicar em "Aceito os Termos de Uso" durante o cadastro, você declara que:
              </p>
              <ul>
                <li>Leu e compreendeu estes Termos de Uso</li>
                <li>Concorda em cumprir todas as disposições</li>
                <li>Autoriza o tratamento de seus dados conforme descrito</li>
                <li>Tem capacidade legal para aceitar estes termos</li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <div className="terms__footer">
            <p className="terms__footer-text">
              <strong>Swaply Educação LTDA</strong><br />
              CNPJ: XX.XXX.XXX/XXXX-XX<br />
              Versão 1.0 - Última atualização: 22 de outubro de 2025
            </p>
            <Button variant="primary" size="large" onClick={handleGoBack}>
              Voltar ao Login
            </Button>
          </div>
        </Card>
      </div>
    </DashboardTemplate>
  );
};

export default Terms;


