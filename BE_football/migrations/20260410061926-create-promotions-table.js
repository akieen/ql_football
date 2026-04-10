'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Promotions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      start_at: {
        type: Sequelize.DATE
      },
      expires_at: {
        type: Sequelize.DATE
      },
      discount_type: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      usage_limit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      min_booking_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      max_discount_amount: {
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
    await queryInterface.dropTable('Promotions');
  }
};
