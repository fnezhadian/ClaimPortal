using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClaimPortal.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClaimantRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Claims_ClaimantId",
                table: "Claims",
                column: "ClaimantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Claimants_ClaimantId",
                table: "Claims",
                column: "ClaimantId",
                principalTable: "Claimants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Claimants_ClaimantId",
                table: "Claims");

            migrationBuilder.DropIndex(
                name: "IX_Claims_ClaimantId",
                table: "Claims");
        }
    }
}
