'use client';
import ViewPleinEcran from "../../composants/viewPleinEcran"

const Projetaws = () => {
  return (
    <section id="projets" className="bg-[#1a1a1a] text-[#e0e0e0] py-20 px-4 font-inter overflow-hidden">
      <div className="max-w-6xl mx-auto text-center px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-[#f0f0f0] mb-16 tracking-[-0.02em]">
          SMS automation for e-commerce deployed on AWS
        </h2>

        <h2 className="text-4xl md:text-3xl font-bold text-[#f0f0f0] mb-5 tracking-[-0.02em]">
          Présentation du projet
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10 justify-center items-stretch">
          <p>
            Ce projet est une application SaaS d’automatisation SMS dédiée aux e-commerces, en particulier ceux utilisant Shopify.
            L’objectif est de permettre aux boutiques en ligne de communiquer efficacement avec leurs clients par SMS, de relancer les paniers abandonnés et de mesurer l’impact de chaque campagne marketing.
            L’utilisateur peut importer ses clients depuis Shopify, filtrer sa base selon plusieurs critères (dernières commandes, clients inactifs, paniers abandonnés, etc.), rédiger un message promotionnel et planifier son envoi.
            Chaque campagne est suivie en temps réel : taux d’envoi, taux de clic, et ventes générées grâce au lien de tracking intégré dans les SMS.
            Le système gère également les SMS de relance automatique pour les paniers abandonnés, ainsi que la facturation (abonnement mensuel et cagnotte prépayée) via Stripe.
          </p>

          <h2 className="text-4xl md:text-3xl font-bold text-[#f0f0f0] mb-5 tracking-[-0.02em]">
            Infra en 2 temps : type « MVP » puis robuste, maîtrisée et scalable
          </h2>

          <h2 className="text-4xl md:text-3xl font-bold text-[#f0f0f0] mb-5 tracking-[-0.02em]">
            Infrastructure cloud « MVP »
          </h2>

          <h2 className="text-xl md:text-xl font-bold text-[#f0f0f0] mb-1 tracking-[-0.02em]">
            Mis à jour le 10/11/25
          </h2>

          <p>
            Pour le MVP, l’objectif était de concevoir une infrastructure rapide à déployer, sécurisée et suffisamment scalable pour supporter les premiers utilisateurs sans complexité inutile.
          </p>
          <ViewPleinEcran
        src="/Architecture10.drawio.svg"
        alt="Diagramme d'architecture AWS pour le SaaS SMS"
            />

          <ul>
            <li>Frontend : développé avec Next.js et React, hébergé sur Vercel. Connecté à Amazon Cognito pour l’authentification des users Admin. </li>
            <li>Backend : API conteneurisée déployée sur AWS App Runner.</li>
            <li>Base de données : Amazon RDS (PostgreSQL).</li>
            <li>Stockage : Amazon S3 pour les rapports d’analytics et les factures. (S3 Lifecycle pour archiver automatiquement les rapports anciens.)</li>
            <li>Sécurité : AWS Secrets Manager pour la gestion des clés API et des accès sensibles.</li>
            <li>Planification des campagnes : EventBridge Scheduler pour exécuter les envois au moment prévu.</li>
            <li>Messagerie : SQS pour gérer les files d’attente et garantir la fiabilité des envois. Consommées par AWS Lambda</li>
            <li>Suivi des livraisons SMS : API Gateway reçoit les webhooks de l’api sms sender, traités par AWS Lambda, qui met à jour les statuts dans DynamoDB (livré, échec, expiré).</li>
            <li>Tracking de liens : API Gateway et Lambda pour rediriger les clics et enregistrer les statistiques dans DynamoDB.</li>
            <li>Synchronisation des données : webhooks Shopify et Stripe gérés par Lambda.</li>
            <li>Monitoring : CloudWatch pour la supervision, les métriques et les alarmes.</li>
            <li>Cette architecture permet un déploiement rapide, tout en assurant une bonne isolation des services et une base solide pour l’évolution du projet.</li>
          </ul>

          <h2 className="text-4xl md:text-3xl font-bold text-[#f0f0f0] mb-5 tracking-[-0.02em]">
            Vers une architecture plus robuste, maîtrisée et scalable
          </h2>

          <p>
            Après validation du MVP, le projet est pensé pour évoluer vers une infrastructure plus complète, capable de monter en charge et de renforcer la sécurité à chaque niveau.
            L’idée est de migrer progressivement vers une architecture basée sur ECS Fargate, avec autoscaling automatique selon la charge, réseau privé via VPC, et Aurora Serverless v2 pour la base de données.
            L’ajout de Redis (ElastiCache) permettra d’optimiser les performances, CloudFront servira de CDN pour accélérer le tracking des liens, et des services comme WAF, GuardDuty et Security Hub viendront renforcer la protection applicative.
            Les workflows complexes, comme la relance automatisée des paniers abandonnés, seront gérés avec AWS Step Functions, tandis qu’Athena et QuickSight permettront une analyse avancée des performances marketing.
            Du coup on aura une application plus résiliente, plus sécurisée et économiquement optimisée.
          </p>

          <h2 className="text-4xl md:text-3xl font-bold text-[#f0f0f0] mb-5 tracking-[-0.02em]">
            Évolutions futures
          </h2>

          <ul>
            <li>- Support d’autres plateformes e-commerce (WooCommerce, Prestashop).</li>
            <li>
              - Implémentation d’un moteur de recommandation IA intelligent entraîné sur les données des conversions en fonction du temps et du type de client pour optimiser les heures d’envoi.
            </li>
          </ul>
        </div>
      </div>

      

      <div>
      </div>
    </section>
  );
}

export default Projetaws;
