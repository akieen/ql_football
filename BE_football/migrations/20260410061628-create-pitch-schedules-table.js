'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('PitchSchedules', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      pitch_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pitches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      date_of_week: {
        type: Sequelize.INTEGER
      },
      open_time: {
        type: Sequelize.TIME
      },
      close_time: {
        type: Sequelize.TIME
      },
      slot_duration_minutes: {
        type: Sequelize.INTEGER
      },
      price_override: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('PitchSchedules');
  }
};
