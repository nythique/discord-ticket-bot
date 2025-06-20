const { 
    Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, 
    StringSelectMenuBuilder, ActivityType 
} = require('discord.js');
const config = require('./config.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const TOKEN = config.token;
const STATUTS = config.statuts

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
    client.user.setPresence({
        activities: [{ name: STATUTS, type: ActivityType.Listening }],
        status: 'dnd', 
    });
});

client.on('interactionCreate', async (interaction) => {
    // Menu de sélection pour la création de ticket/support
    if (interaction.isStringSelectMenu() && interaction.customId === 'support_select') {
        if (interaction.values[0] === 'ticket') {
            // Création d'un thread privé pour le ticket
            if (!interaction.channel || !interaction.guild) {
                await interaction.reply({ content: "Erreur : impossible de créer un ticket ici.", ephemeral: true });
                return;
            }
            if (
                !interaction.channel ||
                !interaction.guild ||
                typeof interaction.channel.threads === "undefined"
            ) {
                await interaction.reply({ content: "Erreur : impossible de créer un ticket ici. Utilise cette commande dans un salon textuel du serveur.", ephemeral: true });
                return;
      }
            const thread = await interaction.channel.threads.create({
                name: `ticket-${interaction.user.username}`,
                autoArchiveDuration: 60,
                reason: 'Ticket support',
                type: 12 // ChannelType.PrivateThread
            });
            // Donne l'accès au créateur du ticket (normalement automatique, mais on le force)
            await thread.members.add(interaction.user.id);

            await thread.send(`Bonjour ${interaction.user}, merci d'expliquer clairement votre demande. Un membre du staff va vous répondre ici.`);
            await interaction.reply({ content: "Votre ticket a été créé !", ephemeral: true });
        } else if (interaction.values[0] === 'faq') {
            await interaction.reply({
                content: `FAQ :\n- Les tickets sont traités du lundi au vendredi.\n- Merci de patienter après votre demande.`,
                ephemeral: true
            });
        }
        return;
    }

    // Menu de sélection pour la procédure de recrutement
    if (interaction.isStringSelectMenu() && interaction.customId === 'recrutement_select') {
        let content = '';
        if (interaction.values[0] === 'chapitre1') {
            content = `🔥 Chapitre 1 - Les informations requises 🔥

1. **Informations globales** 💬

● Quel âge as-tu ?
● Depuis combien de temps es-tu sur Discord ?
● Combien de temps passes-tu sur Discord/semaine ?
● Quel rôle vises-tu ?

2. **Expérience et motivations** 🕒

● As-tu déjà fait partie d'un staff ? Si oui, quel.s rôle.s as-tu occupé ?
● (Répondre si la réponse précédente est affirmative). Pendant combien de temps as-tu occupé ce.s rôle.s ?
● Pourquoi souhaites-tu faire partie du staff ?
● Pourquoi ce serveur en particulier ?

3. **Modération** 🛡️

● Un conflit débute face à toi. Que fais-tu ?
● Tu arrives en plein milieu d'un conflit sans en savoir la raison. Que fais-tu ?
● Comment gères-tu les critiques négatives ?
● Un ami proche ne respecte pas les règles du serveur. Que fais-tu concrètement ?
● Que fais-tu si tu entres en désaccord avec un membre du staff ?

4. **Détails** 📋

● Combien de temps par jour es-tu prêt.e à consacrer à ce serveur ?
● Existe-t-il des périodes dans l'année où tu ne pourras pas être disponible ? (vacances, examens, couvre-feu etc).
● D'après toi, quelles sont les qualités requises pour faire partie du staff ?`;
        } else if (interaction.values[0] === 'chapitre2') {
            content = `🧩 Chapitre 2 - Les conditions 🧩

1. **Sécurité du compte**

● Le compte du postulant doit avoir plus de 5 mois d'existence sur la plateforme Discord.
● Il doit disposer d'une adresse mail vérifiée, d'une double authentification activée et d'un profil respectant les règles de la communauté.

2. **Activités du compte**

● Le postulant doit être un minimum actif sur ce serveur. Le système de niveau nous permettra de savoir à quel point il est actif.

3. **Statut de l'utilisateur**

● L'absence d'une quelconque sanction contre le postulant durant les 7 derniers jours.
● Le postulant doit être membre du serveur depuis plus de 13 jours.`;
        } else if (interaction.values[0] === 'chapitre3') {
            content = `📖 Chapitre 3 - La procédure 📖

1. **Rédaction d'une demande**
● Elle consistera à écrire une demande de recrutement dans laquelle le postulant devra y mettre des informations des chapitres précédents.
2. **Soutenance de la demande**
● Elle sera l'étape à laquelle le postulant devra répondre à certaines questions de la part du staff existant.`;
        }
        await interaction.reply({ content, ephemeral: true });
        return;
    }
});

client.on('messageCreate', async (message) => {
    if (message.content === config.commands) {
        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setTitle('Support')
            .setColor('#808080') 
            .setImage(config.panelImage);

        // Menu de sélection pour le recrutement
        const selectRecrutement = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('recrutement_select')
                    .setPlaceholder('Nouvelles recrues')
                    .addOptions(
                        {
                            label: 'Chapitre 1',
                            description: 'Questions sur ton profil et tes motivations',
                            value: 'chapitre1',
                        },
                        {
                            label: 'Chapitre 2',
                            description: 'Conditions pour postuler',
                            value: 'chapitre2',
                        },
                        {
                            label: 'Chapitre 3',
                            description: 'Comment postuler',
                            value: 'chapitre3',
                        }
                    )
            );

        // Menu de sélection pour le support/ticket
        const selectSupport = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('support_select')
                    .setPlaceholder('Contactez le support')
                    .addOptions(
                        {
                            label: 'Créer un ticket',
                            description: 'Ouvrir un ticket support',
                            value: 'ticket',
                        },
                        {
                            label: 'FAQ',
                            description: 'Questions fréquentes',
                            value: 'faq',
                        }
                    )
            );

        await message.channel.send({ embeds: [embed], components: [selectRecrutement, selectSupport] });
    }
});

client.login(TOKEN);