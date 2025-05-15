const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, ActivityType } = require('discord.js');
const config = require('./config.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = config.token; 

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);

    
    client.user.setPresence({
        activities: [{ name: 'Membre', type: ActivityType.Listening }],
        status: 'dnd', 
    });
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        const { customId } = interaction;

        if (customId === 'view_schedule') {
            await interaction.reply({ content: config.plannig, flags: 64 }); 
        } else if (customId === 'view_conditions') {
            await interaction.reply({ content: config.conditions, flags: 64 }); 
        } else if (customId === 'create_thread') {
            
            const modal = new ModalBuilder()
                .setCustomId('ticket_modal')
                .setTitle('Création de Ticket');

            // Champs de texte pour le modal
            const reasonInput = new TextInputBuilder()
                .setCustomId('reason_input')
                .setLabel('Raison du contact')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Expliquez brièvement pourquoi vous contactez le support.')
                .setRequired(true);

            const detailsInput = new TextInputBuilder()
                .setCustomId('details_input')
                .setLabel('Détails supplémentaires')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Ajoutez des détails supplémentaires si nécessaire.')
                .setRequired(false);

            // Ajout des champs au modal
            const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
            const secondActionRow = new ActionRowBuilder().addComponents(detailsInput);

            modal.addComponents(firstActionRow, secondActionRow);

            // Affiche le modal à l'utilisateur
            await interaction.showModal(modal);
        }
    } else if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === 'ticket_modal') {
            try {
                // Récupère les données saisies par l'utilisateur
                const reason = interaction.fields.getTextInputValue('reason_input');
                const details = interaction.fields.getTextInputValue('details_input');

                // Vérifiez si le canal est défini
                if (!interaction.channel) {
                    return await interaction.reply({ content: 'Impossible de créer un fil : aucun canal associé.', flags: 64 });
                }

                // Crée un fil de discussion
                const thread = await interaction.channel.threads.create({
                    name: `Ticket-${interaction.user.username}`,
                    autoArchiveDuration: 60,
                    type: ChannelType.PrivateThread,
                    reason: 'Création d\'un ticket support',
                });

                // Envoie les informations dans le fil
                await thread.send({
                    content: `**Nouveau ticket créé par ${interaction.user}:**\n\n**Raison :** ${reason}\n**Détails :** ${details || 'Aucun détail fourni.'}`,
                });

                // Ajoute les permissions pour le support
                const supportRole = interaction.guild.roles.cache.find(role => role.id === config.supportRole); /// Remplacez par le nom du rôle de support
                if (supportRole) {
                    await thread.permissionOverwrites.create(supportRole, {
                        ViewChannel: true,
                        SendMessages: true,
                    });
                }

                // Répond à l'utilisateur
                await interaction.reply({ content: 'Votre ticket a été créé avec succès.', flags: 64 });
            } catch (error) {
                console.error('Erreur lors de la création du fil :', error);
                await interaction.reply({ content: 'Une erreur est survenue lors de la création du ticket.', flags: 64 });
            }
        }
    }
});

client.on('messageCreate', async (message) => {
    if (message.content === config.commands) {
        if (message.author.bot) return; // Ignore les messages des bots 
        const embed = new EmbedBuilder()
            .setTitle('Modmail')
            .setDescription("Si vous avez une **grande préoccupation** ou un **problème lié à la modération ou à l'administration**, vous pouvez contacter l'équipe du personnel en appuyant sur le bouton Thread Modmail ci-dessous.\nil y a aussi des **buttons à de gauche et droite** à consulter.")
            .setColor('Blue'); 

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('view_schedule')
                    .setLabel('Voir notre programme')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('create_thread')
                    .setLabel('Thread Modmail')
                    .setStyle(ButtonStyle.Danger), // Bouton rouge
                new ButtonBuilder()
                    .setCustomId('view_conditions')
                    .setLabel('Attention, conditions')
                    .setStyle(ButtonStyle.Secondary),
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }

    if (message.content === '$$.close') { 
        if (message.channel.isThread()) {
            await message.channel.setArchived(true);
            await message.channel.send('Le fil a été fermé et archivé comme log.');
        } else {
            await message.reply('Cette commande doit être utilisée dans un fil.');
        }
    }
});

client.login(TOKEN);